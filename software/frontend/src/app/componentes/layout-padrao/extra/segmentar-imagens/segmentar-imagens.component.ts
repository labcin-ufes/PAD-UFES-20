import { NgForm } from '@angular/forms';
import { SegmentarImagemService } from './../../../../servicos/segmentarImagem.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import Utils from '../../../../utils/utils';
import { URL_API } from '../../../../utils/url-api';
import { ActivatedRoute } from '@angular/router';
import { LesaoCirurgiaService } from '../../../../servicos/lesao-cirurgia.service';
import { LesaoDermatoService } from '../../../../servicos/lesao-dermato.service';
import { ImagemService } from '../../../../servicos/imagem.service';

@Component({
  selector: 'app-segmentar-imagens',
  templateUrl: './segmentar-imagens.component.html',
  styleUrls: ['./segmentar-imagens.component.css'],
})
export class SegmentarImagensComponent implements OnInit {

    /**
  * Input que seleciona quais lesões serão carregadas
  * = cirurgia - carrega imagens de pacientes cirurgia
  * = dermato  - carrega imagens de pacientes dermato
  */
  @Input()
  public tipoPainel = 'cirurgia';

  public url_api: any;

  public flagFalha: boolean;
  public flagShowImg: boolean;
  public flagSegmentar: boolean;
  public lesaoAtualId: number;
  public imagemId: number;
  public imagemPath: string;
  public imagemUrl: string;

  public lesoes: any; // armazena as o array de lesões retornadas pelo servidor
  public pacientes: any; // armazena as o array de pacientes retornados pelo servidor

  // atributos dos filtros
  public segmentado: boolean;
  public cartaoSus: string;
  public tipoPac: string;

  // atributos para paginancao
  public itensPorPag: number; // Define quantos elementos serao retornados por paginas
  public totalItens: number; // Total de itens a ser exibidos na tabela
  public paginaAtual: number; // página atualmente selecionada
  public maxPagLinks: number; // maximo de links que a pagina pode exibir (os boxes com os numeros)
  public totalPaginas: number; // numero de paginas que a consulta retorna

  // atributos para passagem de dado via url
  public dadosUrl: string;
  public lesaoId: number;

  // declaração do serviço que gerencia o acesso aos dados das lesões
  public lesaoService;

  @ViewChild('dadosForm')
  public dadosForm: NgForm;

  constructor(
    private segmentarImagemService: SegmentarImagemService,
    private lesaoCirurgiaService: LesaoCirurgiaService,
    private lesaoDermatoService: LesaoDermatoService,
    private imagemService: ImagemService,
    private actRouter: ActivatedRoute) {

    // atributos paginacao
    this.itensPorPag = 8;
    this.maxPagLinks = 10;
    this.paginaAtual = 1;

    this.url_api = URL_API;
  }

  ngOnInit() {

    this.dadosUrl = this.actRouter.snapshot.params['urlLesao'];

    this.flagFalha = false;
    this.flagShowImg = false;
    this.flagSegmentar = false;
    this.lesaoAtualId = -1;

    this.tipoPac = 'cirurgia';
    this.segmentado = undefined;

    if (this.dadosUrl !== undefined) {
      this.extraiDadosUrl(this.dadosUrl);
    }

    // Retorna todas as imagens ao abrir o painel
    if (this.dadosUrl === undefined) {
      this.filtraDados();
    }
  }

  /**
   * Método para verificar a URL passada e definir se atende aos padrões estabelecidos
   * @author Pedro Biasutti
   * @param dadosUrl
   */
  public validaDadosUrl (dadosUrl: string): void {

    const dadoSplit = dadosUrl.split('_');
    if (dadoSplit.length !== 2) {
      this.dadosUrl = undefined;
    } else if (dadoSplit[0] !== 'cirurgia' && dadoSplit[0] !== 'dermato') {
      this.dadosUrl = undefined;
    }

  }

  /**
   * Método para extrair os dados da URL passada, caso a mesma seja valida,
   * e obter os demais dados da lesao/paciente para que se filtre apenas a lesao selecionada anteriormente
   * @author Pedro Biasutti
   * @param dadosUrl
   */
  public extraiDadosUrl (dadosUrl: string): void {

    this.validaDadosUrl(this.dadosUrl);

    if (this.dadosUrl !== undefined) {

      this.tipoPac = this.dadosUrl.split('_')[0];
      this.lesaoId = parseInt(this.dadosUrl.split('_')[1], 10);
      this.tipoPainel = this.tipoPac;

      if (this.tipoPainel === 'cirurgia') {
        this.lesaoService = this.lesaoCirurgiaService;
      } else {
        this.lesaoService = this.lesaoDermatoService;
      }

      this.pegaSusViaLesaoId(this.lesaoId);
    }

  }

  /**
   * A partir do 'id' da lesão este método obtem o SUS do paciente e já filtra as lesões.
   * @author Guilherme Esgario
   * @param {*} id
   */
  public pegaSusViaLesaoId(id): void {
    this.lesaoService.obtemLesao(id, 'paciente')
    .subscribe(
      resp => {
        console.log(resp);
        this.cartaoSus = resp.cartaoSus;
        this.filtraDados();
      },
      erro => console.log(erro)
    );
  }

  /**
   * Método que trata os dados do form para serem enviados ao servidor
   * @author Guilherme Esgario
   */
  public recebeDadosForm() {
    // Retorna para a página inicial sempre que atualizar lista de dados
    this.paginaAtual = 1;

    // Definindo os valores dos filtros
    this.segmentado = Utils.parseFiltros(this.dadosForm.value.segmentado.toString(), false);
    this.cartaoSus = Utils.parseFiltros(this.dadosForm.value.cartaoSus, false);
    this.tipoPac = Utils.parseFiltros(this.dadosForm.value.tipoPac.toString(), false);

    if (this.tipoPac === 'cirurgia') {
      this.tipoPainel = 'cirurgia';
    } else {
      this.tipoPainel = 'dermato';
    }

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
    console.log('Dados do filtro:\nSegementado:\t', this.segmentado, '\nCartao Sus:\t', this.cartaoSus,
                '\nTipo de Pac:\t', this.tipoPac, '\nLesao Id:\t', this.lesaoId);
    this.segmentarImagemService.filtragem(
      this.paginaAtual - 1,
      this.itensPorPag,
      this.segmentado,
      this.cartaoSus,
      this.tipoPac,
      this.lesaoId
    ).subscribe(
      resp => {
        this.lesoes = resp.content[0].lesoes;
        console.log('lesoes buscadas', this.lesoes);
        this.pacientes = resp.content[0].pacientes;
        console.log('pacientes buscadas', this.pacientes);
        this.totalItens = resp.totalElements;
        this.totalPaginas = resp.totalPages;
        console.log('resp', resp);
      },
      erro => {
        this.flagFalha = true;
        console.log('erro', erro);
      }
    );
  }

  /**
   * Metodo para exibir apenas as imagens pertinentes a lesão selecionada
   * @param lesaoId
   * @author Pedro Biasutti
   */
  private exibeImgPorLesao (lesaoId: number): void {
    this.lesaoAtualId = lesaoId;
  }

  /**
   * Metodo para obter o path da imagem selecionada
   * @param imagemPath passa o path da imagem
   * @param tipoPainel passa o tipo do painel ('cirurgia', 'dermato', 'segmentacao')
   * @author Pedro Biasutti
   */
  private selecImgSeg (imagemId: number, imagemPath: string): void {
    this.imagemId = imagemId;
    this.imagemPath = imagemPath;
    this.flagSegmentar = true;
    this.imagemUrl = URL_API + '/api/imagem/baixar?nomeImg=' + this.imagemPath + '&tipo=' + this.tipoPainel;
  }

  private alternaFlagSegmentado(imagem): void {
    let url: string;
    if (this.tipoPainel === 'dermato') {
        url = URL_API + '/api/imagemDermato/' + imagem.id;
    } else {
        url = URL_API + '/api/imagemCirurgia/' + imagem.id;
    }

    const dados = { 'segmentado': !imagem.segmentado };
    this.imagemService.atualizarImagem(url, dados).subscribe(
        resp => {
            console.log('Tabela atualizada corretamente.');
            this.recebeDadosForm();
        },
        erro => {
            console.log('Erro ao atualizar tabela imagem.');
        }
    );
  }

  public cancelarSegmentacao(): void {
    // Seta flag para ocultar componente do canvas
    this.flagSegmentar = false;
    // Atualiza dados do formulário
    this.recebeDadosForm();
  }

  private pegaCartaoSusPorLesaoId (lesaoId: number): string {
    let cartaoSus;
    this.pacientes.forEach(paciente => {

      paciente.lesoes.forEach(lesao => {

        if (lesao.id === lesaoId) {
          cartaoSus = paciente.cartaoSus;
        }

      });

    });

  return cartaoSus;
  }

}
