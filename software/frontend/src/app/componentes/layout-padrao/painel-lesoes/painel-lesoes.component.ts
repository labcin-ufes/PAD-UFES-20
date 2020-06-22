import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AutoCompletarService } from '../../../servicos/auto-completar.service';
import Utils from '../../../utils/utils';
import { LesaoCirurgiaService } from '../../../servicos/lesao-cirurgia.service';
import { URL_API } from '../../../utils/url-api';
import {Router} from '@angular/router';
import { LesaoDermatoService } from '../../../servicos/lesao-dermato.service';

@Component({
  selector: 'app-painel-lesoes',
  templateUrl: './painel-lesoes.component.html',
  styleUrls: [ './painel-lesoes.component.css' ]
})
export class PainelLesoesComponent implements OnInit {

  /**
  * Input que seleciona quais lesões serão carregadas
  * = cirurgia - carrega imagens de pacientes cirurgia
  * = dermato  - carrega imagens de pacientes dermato
  */
  @Input() tipoPainel = 'cirurgia';

  public url_api;
  public flagFalha: boolean;
  public exibirImagensGrandes: boolean;

  public nomeDiagCliComp: string; // vai pegar o nome do diag para autocompletar
  public nomeDiagHistoComp: string; // vai pegar o nome do diag para autocompletar
  public nomeRegiaoComp: string; // vai pegar o nome da regiao do corpo para autocompletar

  public lesoes: any; // armazena as o array de lesões retornadas pelo servidor

  // atributos para paginancao
  public itensPorPag: number; // Define quantos elementos serao retornados por paginas
  public totalItens: number; // Total de itens a ser exibidos na tabela
  public paginaAtual: number; // página atualmente selecionada
  public maxPagLinks: number; // maximo de links que a pagina pode exibir (os boxes com os numeros)
  public totalPaginas: number; // numero de paginas que a consulta retorna

  // atributos dos filtros
  private diagClinico: string;
  private diagHisto: string;
  private regiao: string;

  @ViewChild('dadosForm')
  public dadosForm: NgForm;

  // definindo as funcoes de callback de autocompletar
  public buscaDiagnostico = this.autoCompletarService.completarDiagnostico;
  public buscaRegiao = this.autoCompletarService.completarRegiao;

  // declaração do serviço que gerencia o acesso aos dados das lesões
  public lesaoService;

  constructor(
    private autoCompletarService: AutoCompletarService,
    private lesaoCirurgiaService: LesaoCirurgiaService,
    private lesaoDermatoService: LesaoDermatoService,
    private router: Router
  ) {
    this.flagFalha = false;
    this.exibirImagensGrandes = true;
    this.url_api = URL_API;

    // atributos paginacao
    this.itensPorPag = 8;
    this.maxPagLinks = 10;
    this.paginaAtual = 1;
  }

  ngOnInit() {
    // Seleciona o serviço de acordo com a variavel tipoPainel
    if (this.tipoPainel === 'cirurgia') {
      this.lesaoService = this.lesaoCirurgiaService;
    } else {
      this.lesaoService = this.lesaoDermatoService;
    }

    // Retorna todas as imagens ao abrir o painel
    this.filtraDados();
  }

  /**
   * @author Guilherme Esgario
   * Método que alterna o modo de exibição das imagens no painel
   * @param {*} evento
   */
  public alteraModoExibicao(modo) {
    if (modo === 'pequeno') {
      this.itensPorPag = 24;
      this.exibirImagensGrandes = false;
    } else {
      this.itensPorPag = 8;
      this.exibirImagensGrandes = true;
    }
    this.filtraDados();
  }

  /**
   * Método que trata os dados do form para serem enviados ao servidor
   * @author Guilherme Esgario
   */
  public recebeDadosForm() {
    // Retorna para a página inicial sempre que atualizar lista de dados
    this.paginaAtual = 1;

    // Definindo os valores dos filtros
    this.diagClinico = Utils.parseFiltros(this.dadosForm.value.diagClinico, false);
    this.diagHisto = Utils.parseFiltros(this.dadosForm.value.diagHisto, false);
    this.regiao = Utils.parseFiltros(this.dadosForm.value.regiao, false);

    this.filtraDados();
  }

  /**
   * Método para identificar a mudança da página ao clicar no botão
   * @author Guilherme Esgario
   * @param event Captura o evento realizado. Com ele é possível pegar
   * valores como a página selecionada
   */
  public mudaPagina(event: any): void {
    // Altera a página quando clicado no link
    this.paginaAtual = event.page;
    // sempre que o usuario trocar a pagina, pegamos a nova pagina dos dados
    this.filtraDados();
  }

  /**
   * Método para filtrar os dados. Basicamente ele chama o serviço de filtragem
   * e devolve os pacientes buscados de acordo com os campos preenchidos
   * @author Guilherme Esgario
   */
  private filtraDados(): void {
    this.lesaoService.filtragem(
      this.paginaAtual - 1,
      this.itensPorPag,
      this.diagClinico,
      this.diagHisto,
      this.regiao
    ).subscribe(
      resp => {
        if ( this.tipoPainel === 'dermato') {
          this.lesoes = resp.content;
        } else if (this.tipoPainel === 'cirurgia') {
          this.lesoes = resp.content[0].lesoes;
        }
        this.totalItens = resp.totalElements;
        this.totalPaginas = resp.totalPages;
        console.log(resp);
        console.log('lesoes', this.lesoes);
        console.log('tipo painel', this.tipoPainel);
      },
      erro => {
        this.flagFalha = true;
        console.log(erro);
      }
    );
  }

  /**
   * A partir do 'id' da lesão este método obtem o SUS do paciente e
   * redireciona para a página de visualização dos dados deste paciente.
   * @author Guilherme Esgario
   * @param {*} id
   * @param {*} tipoPainel - 'cirurgia' ou 'dermato'
   */
  public abrirVisualizarPaciente(id, tipoPainel): void {

    if (tipoPainel === 'cirurgia') {

      this.lesaoService.obtemLesao(id, 'paciente')
      .subscribe(
        resp => this.router.navigateByUrl(`/dashboard/paciente-cirurgia/visualizar-paciente/${resp.cartaoSus}`),
        erro => console.log(erro)
      );

    } else if (tipoPainel === 'dermato') {

      this.lesaoService.obtemLesao(id, 'paciente')
      .subscribe(
        resp => this.router.navigateByUrl(`/dashboard/dermato/visualizar-paciente/${resp.cartaoSus}`),
        erro => console.log(erro)
      );

    }

  }

}
