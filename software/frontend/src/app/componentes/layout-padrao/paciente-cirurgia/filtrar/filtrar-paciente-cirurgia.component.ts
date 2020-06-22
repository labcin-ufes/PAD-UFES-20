import { AutoCompletarService } from './../../../../servicos/auto-completar.service';
import { PacienteCirurgiaService } from './../../../../servicos/paciente-cirurgia.service';
import { NgForm } from '@angular/forms';
import { RegiaoCorpoService } from './../../../../servicos/regiao-corpo.service';
import { DiagnosticoService } from './../../../../servicos/diagnostico.service';
import { CidadeService } from './../../../../servicos/cidade.service';
import { Component, ViewChild } from '@angular/core';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { DataStrPipe } from '../../../../utils/pipes/data-str.pipe';

import Utils from '../../../../utils/utils';
import { logoB64 } from '../../../../utils/utils-logo-b64';
import { LesaoCirurgiaService } from '../../../../servicos/lesao-cirurgia.service';

// Para usar o JsPDF com autotable:
declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');

@Component({
  selector: 'app-filtrar-paciente-cirurgia',
  templateUrl: './filtrar-paciente-cirurgia.component.html',
  styleUrls: ['./filtrar-paciente-cirurgia.component.css'],
  providers: [  ]
})
export class FiltrarPacienteCirurgiaComponent {

  public flagFalha: boolean;
  public nomeLocalComp: string; // vai pegar o nome do local para autocompletar
  public nomeDiagCliComp: string; // vai pegar o nome do diag clinico para autocompletar
  public nomeDiagHistoComp: string; // vai pegar o nome do diag histo para autocompletar
  public nomeRegiaoComp: string; // vai pegar o nome da regiao do corpo para autocompletar

  public exibirPainelPacientes: boolean;
  public pacientesCirurgia: any;

  // atributos para paginancao
  public itensPorPag: number; // Define quantos elementos serao retornados por paginas
  public totalItens: number; // Total de itens a ser exibidos na tabela
  public paginaAtual: number; // página atualmente selecionada
  public maxPagLinks: number; // maximo de links que a pagina pode exibir (os boxes com os numeros)
  public totalPaginas: number; // numero de paginas que a consulta retorna

  // atributos dos filtros
  private nomePaciente: string;
  private localAtendimento: string;
  private diagClinico: string;
  private diagHisto: string;
  private regiao: string;
  private dataInicial: string;
  private dataFinal: string;
  private semLesao: boolean;
  private semImagem: boolean;
  private padLocal: boolean;
  private semHisto: boolean;

  // Itens para colocar na estatistica do cabecalho da pagina
  public numPacientes: number;
  public numCirurgias: number;
  public numImagens: number;

  private gerandoPDF: boolean;

  @ViewChild('dadosForm')
  public dadosForm: NgForm;

  // definindo as funcoes de callback de autocompletar
  public buscaNomeLocal = this.autoCompletarService.completarCidade;
  public buscaDiagnostico = this.autoCompletarService.completarDiagnostico;
  public buscaRegiao = this.autoCompletarService.completarRegiao;

  constructor(private cidadeService: CidadeService,
              private diagnosticoService: DiagnosticoService,
              private regiaoCorpoService: RegiaoCorpoService,
              private pacienteCirurgiaService: PacienteCirurgiaService,
              private autoCompletarService: AutoCompletarService,
              private lesaoCirurgiaService: LesaoCirurgiaService
  ) {
    this.flagFalha = false;
    this.exibirPainelPacientes = false;
    this.gerandoPDF = false;

    // atributos paginacao
    this.itensPorPag = 10;
    this.maxPagLinks = 10;
    this.paginaAtual = 1;
  }

  /**
   * Metodo para tratar os boolean, converter para Sim ou Não
   * @author Pedro Biasutti
   */
  public trataBool (bool: boolean): string {
    switch (bool) {
      case true:
          return 'SIM';
      case false:
          return 'NÃO';

    }
  }

  /**
   * Método para identificar a mudança da página ao clicar no botão
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
   * @author André Pacheco
   */
  private filtraDados (): void {

    /**
     * A função desse IF é chavear entre a busca do ponto de vista da lesão e do ponto de vista do paciente.
     * Acontece, que para filtrar os pacientes sem lesões eu não consigo buscar pela tabela de lesões, uma vez que ela
     * não existe. Logo, eu preciso partir da tabela de paciente. O inverso ocorre quando queremos somente as lesões listadas
     * no filtro. Se busco de um paciente, ele lista todas as lesões.
     */
    if (this.semLesao) {

      this.pacienteCirurgiaService.filtragem(
        this.paginaAtual - 1,
        this.itensPorPag,
        this.diagClinico,
        this.diagHisto,
        this.regiao,
        this.dataInicial,
        this.dataFinal,
        this.localAtendimento,
        this.nomePaciente,
        this.semLesao,
        this.semImagem,
        this.padLocal,
        this.semHisto
      ).subscribe(
        resp => {
          if (this.gerandoPDF) {

            this.escrevePDF(resp.content[0].pacientes);
            this.gerandoPDF = false;

          } else {
            this.exibirPainelPacientes = true;
            this.pacientesCirurgia = resp.content[0].pacientes;
            this.totalItens = resp.totalElements;
            this.totalPaginas = resp.totalPages;
            console.log(resp);

            // estatisticas
            this.numPacientes = resp.content[0].numPacientes;
            this.numCirurgias = resp.content[0].numLesoes;
            this.numImagens = resp.content[0].numImagens;
          }
        },
        erro => {
          console.log(erro);
        }
      );

    } else {

      this.lesaoCirurgiaService.filtragem(
        this.paginaAtual - 1,
        this.itensPorPag,
        this.diagClinico,
        this.diagHisto,
        this.regiao,
        this.dataInicial,
        this.dataFinal,
        this.localAtendimento,
        this.nomePaciente,
        this.semLesao,
        this.semImagem,
        this.padLocal,
        this.semHisto
      ).subscribe(
        resp => {
          if (this.gerandoPDF) {

            this.escrevePDF(resp.content[0].pacientes);
            this.gerandoPDF = false;

          } else {
            this.exibirPainelPacientes = true;
            this.pacientesCirurgia = resp.content[0].pacientes;
            this.totalItens = resp.totalElements;
            this.totalPaginas = resp.totalPages;
            console.log(resp);

            // estatisticas
            this.numPacientes = resp.content[0].numPacientes;
            this.numCirurgias = resp.content[0].numLesoes;
            this.numImagens = resp.content[0].numImagens;
          }
        },
        erro => {
          console.log(erro);
        }
      );
    }
  }

  /**
   * Método que recebe os dados do formulario com os filtros preenchidos
   * e chama o método de filtragem para retornar todos os pacientes recuperados
   * de acordo com os filtros
   * @author André Pacheco
   */
  public recebeDadosForm (): void {

    // Sempre que chegar novos dados do formulario, voltamos para pagina zero
    this.paginaAtual = 1;

    // Definindo os valores dos filtros
    this.nomePaciente = Utils.parseFiltros(this.dadosForm.value.nomePaciente, false);
    this.localAtendimento = Utils.parseFiltros(this.dadosForm.value.localAtendimento, false);
    this.diagClinico = Utils.parseFiltros(this.dadosForm.value.diagClinico, false);
    this.diagHisto = Utils.parseFiltros(this.dadosForm.value.diagHisto, false);
    this.regiao = Utils.parseFiltros(this.dadosForm.value.regiao, false);

    this.dataInicial = Utils.converterStrDate(this.dadosForm.value.dataInicial);
    this.dataFinal = Utils.converterStrDate(this.dadosForm.value.dataFinal);

    this.semLesao = Utils.parseFiltros(this.dadosForm.value.semLesao, true);
    this.semImagem = Utils.parseFiltros(this.dadosForm.value.semImagem, true);
    this.padLocal = Utils.parseFiltros(this.dadosForm.value.padLocal, true);
    this.semHisto = Utils.parseFiltros(this.dadosForm.value.semHisto, true);

    /*
    console.log('Nome Paciente: ', this.nomePaciente);
    console.log('Local Atendimento: ', this.localAtendimento);
    console.log('Diag. Cli: ', this.diagClinico);
    console.log('Diag. Histo.:', this.diagHisto);
    console.log('Regiao: ', this.regiao);
    console.log('Data Inicial: ', this.dataInicial);
    console.log('Data final: ', this.dataFinal);
    console.log('Sem lesao: ', this.semLesao);
    console.log('Sem imagem: ', this.semImagem);
    console.log('Pad local: ', this.padLocal);
    console.log('Sem histo: ', this.semHisto);
    */

    // preenchido os dados, fazemos a filtragem
    this.filtraDados();
  }


  public gerarPDF (): void {

    this.gerandoPDF = true;
    // Para gerar o pdf tem que solicitar todos os dados e nao uma pagina apenas
    // logo, tem que fazer o filtro de novo, mas pegando todos dados. Isso será
    // feito setando o size com o tamanho da busca.
    this.itensPorPag = this.numCirurgias;
    this.paginaAtual = 1;
    this.filtraDados();
    this.itensPorPag = 10;

  }

  private escrevePDF (pacs: any[]): void {

    const sadeLogo = logoB64;
    const dataPipe = new DataStrPipe();

    const doc = new jsPDF('landscape');
    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(12);
    doc.text(20, 20, 'Filtros utilizados:');
    doc.line(20, 21, 55, 21);

    // adicionando a imagem
    doc.addImage(sadeLogo, 'JPEG', 230, 15, 50, 15);

    // Dados do filtro
    doc.setFontType('normal');
    doc.setFontSize(10);
    doc.text(20, 30, this.nomePaciente ? 'Nome: ' + this.nomePaciente : 'Nome: NÃO INFORMADO');
    doc.text(100, 30, this.localAtendimento ? 'Local: ' + this.localAtendimento : 'Local: NÃO INFORMADO');
    doc.text(20, 35, this.diagClinico ? 'Diag. clínico: ' + this.diagClinico : 'Diag. clínico: NÃO INFORMADO');
    doc.text(100, 35, this.diagHisto ? 'Diag. Histo.: ' + this.diagHisto : 'Diag. Histo.: NÃO INFORMADO');
    doc.text(20, 40, this.regiao ? 'Região: ' + this.regiao : 'Região: NÃO INFORMADA');
    doc.text(100, 40, this.dataInicial ? 'Data inicial: ' + dataPipe.transform(this.dataInicial) : 'Data inicial: NÃO INFORMADA');
    doc.text(165, 40, this.dataFinal ? 'Data final: ' + dataPipe.transform(this.dataFinal) : 'Data final: NÃO INFORMADA');
    doc.text(20, 45, this.semLesao ? 'Sem lesão? ' + this.trataBool(this.semLesao) : 'Sem lesão? NÃO');
    doc.text(60, 45, this.semImagem ? 'Sem imagem? ' + this.trataBool(this.semImagem) : 'Sem imagem? NÃO');
    doc.text(20, 50, this.padLocal ? 'Pad Local? ' + this.trataBool(this.padLocal) : 'Pad Local? NÃO');
    doc.text(60, 50, this.semHisto ? 'Sem histo.? ' + this.trataBool(this.semHisto) : 'Sem histo.? NÃO');

    // resumo do resultado
    doc.setFontType('bold');
    doc.setFontSize(12);
    doc.text(20, 60, 'Números do resultado:');
    doc.line(20, 62, 67, 62);

    // Numeros do resulto
    doc.setFontType('normal');
    doc.setFontSize(12);
    doc.text(20, 70, 'Total de pacientes: ' + this.numPacientes);
    doc.text(80, 70, 'Total de lesões/cirurgia: ' + this.numCirurgias);

    // Agora vem a tabela
    doc.setFontType('bold');
    doc.setLineWidth(0.1);
    doc.setFontSize(12);
    doc.text(20, 80, 'Dados filtrados:');
    doc.line(20, 82, 52, 82);

    // Começando a escrita da tabela em si

    let posVer = 80;
    let n_pac = 1;

    for (const pac of pacs) {

      // primeira verificação para quebra de pagina
      if (posVer + 30 >= 200) {
        doc.addPage();
        posVer = 20;
      }

      // Cabecalho
      doc.setFontType('bold');
      doc.setFontSize(14);
      doc.setTextColor(40, 128, 186);
      posVer += 10;
      doc.text(20, posVer, 'Paciente ' + n_pac + ':');

      doc.setFontSize(10);
      posVer += 5;
      doc.text(20, posVer, 'Cartão SUS');
      doc.text(65, posVer, 'Nome');
      doc.text(175, posVer, 'Data de nascimento');
      doc.text(220, posVer, 'Nº Lesões');

      // Dados do paciente
      doc.setTextColor(0, 0, 0);
      posVer += 5;
      doc.setFontType('normal');
      doc.text(20, posVer, pac.cartaoSus);
      doc.text(65, posVer, pac.nomeCompleto);
      doc.text(175, posVer, Utils.dataParaBr(pac.dataNascimento));
      doc.text(220, posVer, pac.lesoes.length.toString());

      // Cabeçalho da lesão
      doc.setTextColor(40, 128, 186);
      doc.setFontType('bold');
      posVer += 5;
      doc.text(20, posVer, 'Lesões:');

      posVer += 5;

      doc.setFontSize(8);
      doc.text(20, posVer, 'Diag. Clínico: ');
      doc.text(85, posVer, 'Histo.: ');
      doc.text(150, posVer, 'Região: ');
      doc.text(210, posVer, 'Local: ');
      doc.text(260, posVer, 'Data: ');

      // Dados da lesão
      let n_les = 1;
      for (const les of pac.lesoes) {

        // segunda verificação para quebra de pagina
        if (posVer + 10 >= 200) {
          doc.addPage();
          posVer = 20;
        }

        posVer += 5;

        doc.setTextColor(0, 0, 0);
        doc.setFontType('normal');

        doc.text(20, posVer, n_les + ') ');

        doc.text(24, posVer, les.diagnosticoClinico);
        if (les.diagnosticoHisto === null || les.diagnosticoHisto === undefined) {
          doc.text(85, posVer, 'NÃO INFORMADO');
        } else {
          doc.text(85, posVer, les.diagnosticoHisto);
        }
        doc.text(150, posVer, les.regiao);
        doc.text(210, posVer, les.localProcedimento);
        doc.text(260, posVer, Utils.dataParaBr(les.dataProcedimento));

        n_les++;

      }

      posVer += 5;
      doc.line(20, posVer, 283, posVer); // horizontal line

      // Checando as variaveis de controle
      n_pac++;
    }

    /*
    const cabecalho = [['Cartão SUS', 'Nome', 'Idade', 'Último atendimento', 'Local', 'Nº de lesões']];
    const corpo = new Array<any>();

    for (const pac of pacs) {
      console.log(pac.cartaoSus);
      const dadosPac = new Array<string>();
      dadosPac.push(pac.cartaoSus);
      dadosPac.push(pac.nomeCompleto);
      dadosPac.push(Utils.calculaIdade(pac.dataNascimento).toString());
      dadosPac.push(Utils.dataParaBr(pac.dataUltimoAtendimento));
      dadosPac.push(pac.localUltimoAtendimento);
      dadosPac.push(pac.lesoes.length.toString());
      corpo.push(dadosPac);
    }

    doc.autoTable({
          startY: 87,
          head: cabecalho,
          body: corpo
      });
      doc.save();
    */

    doc.save();
  }

}
