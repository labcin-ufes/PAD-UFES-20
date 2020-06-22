import { Component, ViewChild, OnInit, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PacienteCirurgiaService } from '../../../../servicos/paciente-cirurgia.service';
import PacienteCirurgia from '../../../../modelo/PacienteCirurgia';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalContentComponent } from './modal-content/modal-content.component';
import { logoB64 } from '../../../../utils/utils-logo-b64';
import Utils from '../../../../utils/utils';
import { LesaoCirurgiaService } from '../../../../servicos/lesao-cirurgia.service';
import { ImagemService } from '../../../../servicos/imagem.service';

// Para usar o JsPDF com autotable:
declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');

@Component({
  selector: 'app-visualizar-paciente',
  templateUrl: './visualizar-paciente.component.html',
  styleUrls: ['./visualizar-paciente.component.css']
})
export class VisualizarPacienteComponent implements OnInit {
  @ViewChild('buscaPacienteForm')
  public buscaPacienteForm: NgForm;
  private cartaoSus: string;

  public paciente: any;
  public lesoes: any = null; // Usada para mostrar todas as lesoes no pdf
  public lesoesPag: any = null; // Usada para mostrar as lesoes na web
  public imagens: any = [];
  public flagSucesso: boolean;
  public flagFalha: boolean;
  public flagTotalLesoes: boolean;
  public gerandoPDF = false;

  // Esse decorador permite recuperar os dados do formulario no template html
  @ViewChild('dadosCadastroForm')
  public dadosCadastroForm: NgForm;
  public cartaoSusForm: string;
  public cartaoSusURL: string;
  public cartaoSUS: string;

  // flags para controle de divs
  public flagFalhaReq: boolean;
  public isRequisicaoURL: boolean;
  public cartaoSusValido: boolean;
  public cartaoSusInvalidoURL: boolean;
  public pacienteNaoEncontrado: boolean;
  public modalRef: BsModalRef;
  public totalPaginas: number;
  public paginaAtual: number;
  public maxPagLinks: number;
  public totalItens: number;
  public itensPorPag: number;

  constructor(
      private pacienteCirurgiaService: PacienteCirurgiaService,
      private lesaoCirurgiaService: LesaoCirurgiaService,
      private imagemService: ImagemService,
      private router: Router,
      private actRouter: ActivatedRoute,
      private modalService: BsModalService
    ) {
        this.cartaoSusValido = false;
        this.cartaoSusInvalidoURL = false;
        this.isRequisicaoURL = false;
        this.paginaAtual = 1;
        this.maxPagLinks = 10;
        this.itensPorPag = 10;
     }

  ngOnInit() {
    const cartaoURL = this.actRouter.snapshot.params['cartaoSus'];

    // checando se o cartão foi passado via URL e se ele é válido
    if (cartaoURL !== undefined) {
        this.isRequisicaoURL = true;
        if (cartaoURL.length === 18 && this.checaFormatoCartao( cartaoURL )) {
            this.cartaoSusURL = cartaoURL;
            this.cartaoSusInvalidoURL = false;
            this.buscarPacienteURL();
        } else {
            this.cartaoSusURL = 'invalido';
            this.cartaoSusInvalidoURL = true;
            this.isRequisicaoURL = false;
         }
    }
    console.log(this.cartaoSusValido);
    console.log(this.cartaoSusURL);
  }

  public validaCartaoSus(): void {
    if (this.cartaoSusForm.length === 18) {
        this.cartaoSusValido = true;
    } else {
        this.cartaoSusValido = false;
    }
}

public checaFormatoCartao( cartaoSus: string ): boolean {
    const cartaoSusArr = cartaoSus.split('-');
    if ( cartaoSusArr.length !== 4 ) {
        return false;
    }
    if ( cartaoSusArr[0].length !== 3 ) {
        return false;
    }
    if ( cartaoSusArr[1].length !== 4 ) {
        return false;
    }
    if ( cartaoSusArr[2].length !== 4 ) {
        return false;
    }
    if ( cartaoSusArr[3].length !== 4 ) {
        return false;
    }
    return true;
}

public buscarPacienteCartao(): void {
    this.pacienteNaoEncontrado = false;
    this.cartaoSUS = this.cartaoSusForm;
    this.buscarPaciente(this.cartaoSusForm);
}

public buscarPacienteURL(): void {
    this.pacienteNaoEncontrado = false;
    this.cartaoSUS = this.cartaoSusURL;
    this.buscarPaciente(this.cartaoSusURL);
}

/**
   * @author Breno K
   * @param cartao cartão sus do paciente
   * Método para buscar paciente e suas lesoes através de cartao do sus
   */
  public buscarPaciente(cartao: string): void {
    this.pacienteCirurgiaService.obtemPacCompletoPorCartaoSUS(cartao).subscribe(
        resp => {
            if ( resp === null ) {
                this.pacienteNaoEncontrado = true;
                this.flagSucesso = false;
                this.isRequisicaoURL = false;
            } else {
                this.paciente = this.trataRespostas(resp);
                this.flagFalhaReq = false;
                this.flagSucesso = true;
            }
        },
        erro => {
            if (erro.status === 404 || erro.status === 409) {
                this.pacienteNaoEncontrado = true;
            } else {
                this.flagFalhaReq = true;
            }
            this.flagSucesso = false;
            this.isRequisicaoURL = false;
        });
    }

    public mudaPagina(event: any): void {
        // Altera a página quando clicado no link
        this.paginaAtual = event.page;
        // sempre que o usuario trocar a pagina, pegamos a nova pagina dos dados
        this.mostraLesoes();
    }

    /**
     * Metodo para obter todas as lesoes do paciente para que seja gerado o pdf completo
     * @author Pedro Basutti
     */
    public geraLesoesPDF(): void {

        if ( this.lesoes !== null) {
            return;
        }

        this.lesaoCirurgiaService.obtemLesoesPaginada( this.paciente.id, 0, 0 )
        .subscribe(
            resp => {
                this.lesoes = resp._embedded.lesaoCirurgia;
                this.escrevePDF();
            },
            erro => {
                console.log('erro', erro);
            }
        );
    }

    public mostraLesoes(): void {
        this.lesoesPag = this.lesoes;

        if ( this.lesoesPag !== null && this.lesoes === null) {
            return;
        }
        this.lesaoCirurgiaService.obtemLesoesPaginada( this.paciente.id, this.paginaAtual - 1, this.maxPagLinks )
        .subscribe(
            resp => {
                console.log(resp);
                this.lesoesPag = resp._embedded.lesaoCirurgia;
                this.totalItens = resp.page.totalElements;
                this.totalPaginas = resp.page.totalPages === 0 ? resp.page.totalPages + 1 : resp.page.totalPages;
                if ( this.gerandoPDF ) {
                    this.geraLesoesPDF();
                }
            }
        );
    }

    public abrirModal( template: TemplateRef<any>, lesao: any ): void {
        lesao = this.trataLesao(lesao);
        this.imagemService.obtemImagensUrl( lesao._links.imagens.href )
        .subscribe(
            resp => {
                this.imagens = resp._embedded.imagemCirurgia;
                console.log(this.imagens);
                const initialState = {lesao: lesao, imagens: this.imagens};
                this.modalRef = this.modalService.show(ModalContentComponent, {initialState});
            }
        );
    }

    public linkEditaPaciente(): void {
        this.router.navigateByUrl(`/dashboard/paciente-cirurgia/editar-paciente/${this.paciente.cartaoSus}`);
    }

    public gerarPDF(): void {
        if ( this.lesoes == null ) {
            this.gerandoPDF = true;
            this.mostraLesoes();
        } else {
                this.escrevePDF();
        }
    }

    public escrevePDF(): void {
        const sadeLogo = logoB64;

        const doc = new jsPDF();

        doc.addImage(sadeLogo, 'JPEG', 150, 10, 50, 10);

        doc.setFont('helvetica');
        doc.setFontType('bold');
        doc.setFontSize(22);
        doc.text(20, 15, 'Paciente');
        doc.line(20, 16, 52, 16);

        // Informações pessoais
        doc.setFontSize(14);
        doc.text(20, 25, 'Informações pessoais');

        doc.setFontType('normal');
        doc.setFontSize(10);
        doc.text( 20, 30, 'Nome: ' + this.paciente.nomeCompleto);
        doc.text( 20, 35, 'Número do prontuário: ' + this.paciente.prontuario);
        doc.text( 20, 40, 'Número do cartão do SUS: ' + this.paciente.cartaoSus);
        doc.text( 20, 45, 'Nome da mãe: ' + this.paciente.nomeMae);
        doc.text( 20, 50, 'Data de Nascimento: ' + Utils.dataParaBr(this.paciente.dataNascimento));
        doc.text( 20, 55, 'Idade: ' + Utils.calculaIdade(this.paciente.dataNascimento).toString() + ' anos');
        doc.text( 20, 60, 'Sexo: ' + this.paciente.sexo);
        doc.text( 20, 65, 'Estado civil: ' + this.paciente.estadoCivil);
        doc.text( 20, 70, 'Local de nascimento: ' + this.paciente.localNascimento);
        doc.text( 20, 75, 'Origem familiar paterna: ' + this.paciente.origemFamiliarPai);
        doc.text( 20, 80, 'Origem familiar materna: ' + this.paciente.origemFamiliarMae);
        doc.text( 20, 85, 'Atividade principal: ' + this.paciente.atvPrincipal);
        doc.text( 20, 90, 'Idade em que começou a exercê-la: ' + this.paciente.idadeInicioAtv + ' anos');
        doc.text( 20, 95, 'Local do último atendimento: ' + this.paciente.localUltimoAtendimento);
        doc.text( 20, 100, 'Data do último atendimento: ' + this.paciente.dataUltimoAtendimento);
        doc.text( 20, 105, 'Número de vezes que já foi atendido pelo PAD: ' + this.paciente.numVezesAtendido);
        doc.text( 20, 110, 'Endereço: ' + this.paciente.endereco);

        // Informações do cotidiano
        doc.setFontType('bold');
        doc.setFontSize(14);
        doc.text( 20, 120, 'Informações do cotidiano e socioeconômicas');

        doc.setFontType('normal');
        doc.setFontSize(10);
        doc.text( 20, 125, 'Tempo de exposição ao sol por dia: ' + this.paciente.expSol);
        doc.text( 20, 130, 'Parte do dia em que fica mais exposto: ' + this.paciente.horaExpSol);
        doc.text( 20, 135, 'Contato com agrotóxico: ' + this.paciente.usoAgrotoxico);
        doc.text( 20, 140, 'Uso de bebida: ' + this.paciente.usoBebida);
        doc.text( 20, 145, 'Uso de cigarro: ' + this.paciente.usoCigarro);
        doc.text( 20, 150, 'Uso de chapéu: ' + this.paciente.usoChapeu);

        /* // adiciona nova página
        doc.addPage();
        doc.addImage(sadeLogo, 'JPEG', 150, 15, 50, 15);
        doc.setFontType('bold');
        doc.setFontSize(24);
        doc.text(20, 20, this.paciente.nomeCompleto);
        doc.line(20, 21, 20+(5.3 * this.paciente.nomeCompleto.length), 21); */

        // Continua Informações do cotidiano
        doc.setFontType('normal');
        doc.setFontSize(10);
        doc.text( 20, 155, 'Uso de calças compridas: ' + this.paciente.usoCalcaCumprida);
        doc.text( 20, 160, 'Uso de camisa de mangas compridas: ' + this.paciente.usoMangaCumprida);
        doc.text( 20, 165, 'Uso de filtro solar: ' + this.paciente.usoFiltroSolar);
        doc.text( 20, 170, 'Renda familiar: ' + this.paciente.renda);
        doc.text( 20, 175, 'Número de pessoas que vive na residência: ' + this.paciente.numPessoasCasa);
        doc.text( 20, 180, 'Agua encanada: ' + this.paciente.aguaEncanada);
        doc.text( 20, 185, 'Rede esgoto: ' + this.paciente.redeEsgoto);
        doc.text( 20, 190, 'Observação em geral: ' + this.paciente.obs);

        // Informações técnicas
        doc.setFontType('bold');
        doc.setFontSize(14);
        doc.text(20, 200, 'Informações técnicas');

        doc.setFontType('normal');
        doc.setFontSize(10);
        doc.text( 20, 205, 'Tipo de pele: ' + this.paciente.tipoPele);
        doc.text( 20, 210, 'Grau de destrofia solar: ' + this.paciente.destrofiaSolar);
        doc.text( 20, 215, 'Alergia a medicamento: ' + this.paciente.alergia);
        doc.text( 20, 220, 'Diabetes: ' + this.paciente.diabetes);
        doc.text( 20, 225, 'Anticoagulante: ' + this.paciente.usoAnticoagulante);
        doc.text( 20, 230, 'Pressão arterial sistolica: ' + this.paciente.presArtSistolica);
        doc.text( 20, 235, 'Pressão arterial diastolica: ' + this.paciente.presArtDiastolica);
        doc.text( 20, 240, 'HAS: ' + this.paciente.hipertensao);
        doc.text( 20, 245, 'Histórico de câncer de pele na família: ' + this.paciente.histCancerPele);
        doc.text( 20, 250, 'Histórico de outro câncer na família: ' + this.paciente.histCancer);

        const cabecalho = [[ 'Diagnóstico Clínico', 'Diagnóstico Histopatológico', 'Região', 'Procedimento' ]];
        const corpo = new Array<any>();

        for ( const lesao of this.lesoes ) {
            console.log(lesao);
            const lesaoPac = new Array<string>();
            lesaoPac.push( lesao.diagnosticoClinico );
            lesaoPac.push( lesao.diagnosticoHisto !== null ? lesao.diagnosticoHisto : 'SEM RESULTADO' );
            lesaoPac.push( lesao.regiao );
            lesaoPac.push( lesao.procedimento );
            corpo.push(lesaoPac);
        }

        doc.autoTable({
            startY: 255,
            head: cabecalho,
            body: corpo
        });
        doc.save();
    }

  private trataRespostas( paciente: any ): any {
    paciente.estadoCivil = this.trataEstadoCivil( paciente.estadoCivil );
    paciente.destrofiaSolar = this.trataDestrofia ( paciente.destrofiaSolar );
    paciente.horaExpSol = this.trataExposicaoSol( paciente.horaExpSol );
    paciente.renda = this.trataRenda( paciente.renda );
    paciente.usoBebida = this.trataBebida( paciente.usoBebida );
    paciente.usoCigarro = this.trataCigarro( paciente.usoCigarro );
    paciente.sexo = this.trataSexo( paciente.sexo );
    paciente.usoChapeu = this.trataSimNao( paciente.usoChapeu );
    paciente.usoCalcaCumprida = this.trataSimNao( paciente.usoCalcaCumprida );
    paciente.usoMangaCumprida = this.trataSimNao( paciente.usoMangaCumprida );
    paciente.usoFiltroSolar = this.trataSimNao( paciente.usoFiltroSolar );
    paciente.aguaEncanada = this.trataSimNao( paciente.aguaEncanada );
    paciente.redeEsgoto = this.trataSimNao( paciente.redeEsgoto );
    paciente.diabetes = this.trataSimNao( paciente.diabetes );
    paciente.usoAnticoagulante = this.trataSimNao( paciente.usoAnticoagulante );
    paciente.hipertensao = this.trataSimNao( paciente.hipertensao );
    paciente.histCancerPele = this.trataSimNao( paciente.histCancerPele );
    paciente.histCancer = this.trataSimNao( paciente.histCancer );
    return paciente;
  }

  private trataSexo( sexo: string ): string {
    if (sexo === 'F') {
        return 'FEMININO';
    } else {
        return 'MASCULINO';
    }
  }

  private trataEstadoCivil( estadoCivil: string ): string {
    switch ( estadoCivil ) {
        case 'C':
            return 'CASADO';
        case 'S':
            return 'SOLTEIRO';
        case 'V':
            return 'VIÚVO';
        case 'D':
            return 'DIVORCIADO';
        default:
            return 'DESCONHECIDO';
    }
  }

  private trataDestrofia( destrofiaSolar: string ): string {
    switch ( destrofiaSolar ) {
        case 'L':
            return 'LEVE';
        case 'M':
            return 'MODERADA';
        case 'F':
            return 'FORTE';
        case 'A':
            return 'AUSENTE';
        case 'P':
            return 'PRÉ-DISTRÓFICA';
        default:
            return 'DESCONHECIDO';
    }
  }

  private trataExposicaoSol( expSol: string ): string {
    switch (expSol) {
        case 'M':
            return 'ANTES DAS 9H E A PARTIR DAS 16H';
        case 'T':
            return 'ENTRE 9H E 16H';
        case 'A':
            return 'O DIA INTEIRO';
        default:
            return 'DESCONHECIDO';
    }
  }

  private trataSimNao( tipo: string ): string {
    if (tipo === 'S') {
        return 'SIM';
    } else {
        return 'NÃO';
    }
  }

  private trataRenda( renda: string ): string {
    switch (renda) {
        case 'A1':
            return 'MENOR OU IGUAL A 1 SALÁRIO MÍNIMO';
        case '1-3':
            return 'MAIOR QUE 1 E MENOR OU IGUAL A 3 SALÁRIOS MÍNIMOS';
        case '3-5':
            return 'MAIOR QUE 3 E MENOR OU IGUAL A 5 SALÁRIOS MÍNIMOS';
        case 'M5':
            return 'MAIOR DO QUE 5 SALÁRIOS MÍNIMOS';
        default:
            return 'DESCONHECIDO';
    }
  }

  private trataBebida( bebida: string ): string {
    switch ( bebida ) {
        case 'DIA':
            return 'DIARIAMENTE';
        case 'FDS':
            return 'FIM DE SEMANA';
        default:
            return 'NÃO BEBE';
    }
  }

  private trataCigarro( cigarro: string ): string {
    switch ( cigarro ) {
        case 'ATES':
            return 'MENOS DE 5 CIGARROS POR DIA';
        case '5A10':
            return 'DE 5 A 10 CIGARROS POR DIA';
        case 'M10':
            return 'MAIS DE 10 CIGARROS POR DIA';
        default:
            return 'NAO FUMA';
    }
  }

  private trataClark( clark: string): string {
    switch ( clark ) {
        case 'NF':
            return 'NÃO INFORMADO';
        default:
            return clark;
    }
  }

  private trataLimiteRessecao( limiteRessecao: string): string {
    console.log('limiteRessecao func', limiteRessecao)
    switch ( limiteRessecao ) {
        case 'LCN':
            return 'LIVRES DE COMPROMETIMENTO NEOPLÁSICO';
        case 'CML':
            return 'COMPROMETIDO NA MARGEM LATERAL';
        case 'CMP':
            return 'COMPROMETIDO NA MARGEM PROFUNDA';
        case 'CMPL':
            return 'COMPROMETIDO NA MARGEM PROFUNDA E LATERAL';
        default:
            return 'NÃO INFORMADO';
    }
  }

  /**
   * @author Breno K
   * Essa função trata a conversao de todos inpust com opção NAO INFORMADO, PRESENTE, AUSENTE. A saber:
   *    infiltracaoPerineural, infiltracaoAngeolinfatica, infiltradoLinfocito, ulceracao, lesaoSatelite,
   *    evidenciaRegressao, associacaoNevoMelanocito, invsaoVascular.
   *   @param valor
   */
  private trataPresenteAusenteNf ( valor: string ): string {
      switch (valor) {
          case 'NF':
              return 'NÃO INFORMADO';
          default:
              return valor ;
        }
  }

  /**
   * @author Breno K
   * Essa função trata a conversao de todos inpust de margemCirurgua. A saber:
   *    margemCirurgiaProfunda, margemCirurgiaLateral.
   *   @param margem
   */
  private trataMargemCirurgia (margem: string): string {
      switch (margem) {
          case 'LCN':
            return 'LIVRE DE COMPROMETIMENTO NEOPLÁSICO';
          default:
              return margem;
      }
  }

  /**
   * @author Breno K
   * Essa função trata a conversao de todos inputs de faseCrescimento. A saber:
   *    faseCrescimentoVertical, faseCrescimentoRadial.
   *   @param crescimento
   */
  private trataFaseCrescimento (crescimento: string): string {
    switch (crescimento) {
        case 'NSA':
          return 'NÃO SE APLICA';
        default:
            return crescimento;
    }
}

    private trataLesao( lesao: any): any {

        lesao.clark = lesao.clark !== null ? this.trataClark(lesao.clark) : null;
        console.log('lesao.limiteRessecao', lesao.limiteRessecao);
        lesao.limiteRessecao = lesao.limiteRessecao !== null ? this.trataLimiteRessecao(lesao.limiteRessecao) : null;
        console.log('lesao.limiteRessecao', lesao.limiteRessecao);
        lesao.margemCirurgiaProfunda = lesao.margemCirurgiaProfunda !== null ?
                        this.trataMargemCirurgia(lesao.margemCirurgiaProfunda) : null;

        lesao.margemCirurgiaLateral = lesao.margemCirurgiaLateral !== null ?
                        this.trataMargemCirurgia(lesao.margemCirurgiaLateral) : null;

        lesao.crescimentoRadial = lesao.faseCrescimentoRadial !== null ?
                        this.trataFaseCrescimento(lesao.crescimentoRadial) : null;

        lesao.crescimentoVertical = lesao.faseCrescimentoVertical !== null ?
                        this.trataFaseCrescimento(lesao.crescimentoVertical) : null;

        lesao.faseCrescimentoRadial = lesao.faseCrescimentoRadial !== null ?
                        this.trataFaseCrescimento(lesao.faseCrescimentoRadial) : null;

        lesao.infiltracaoPerineural = lesao.infiltracaoPerineural !== null ?
                        this.trataPresenteAusenteNf(lesao.infiltracaoPerineural) : null;

        lesao.infiltracaoAngiolinfatica = lesao.infiltracaoAngiolinfatica !== null ?
                        this.trataPresenteAusenteNf(lesao.infiltracaoAngiolinfatica) : null;

        lesao.infiltradoLinfocito = lesao.infiltradoLinfocito !== null ?
                        this.trataPresenteAusenteNf(lesao.infiltradoLinfocito) : null;

        lesao.ulceracao = lesao.ulceracao !== null ? this.trataPresenteAusenteNf(lesao.ulceracao) : null;

        lesao.lesaoSatelite = lesao.lesaoSatelite !== null ?
                        this.trataPresenteAusenteNf(lesao.lesaoSatelite) : null;

        lesao.evidenciaRegressao = lesao.evidenciaRegressao !== null ?
                        this.trataPresenteAusenteNf(lesao.evidenciaRegressao) : null;

        lesao.associacaoNevoMelanocito = lesao.associacaoNevoMelanocito !== null ?
                        this.trataPresenteAusenteNf(lesao.associacaoNevoMelanocito) : null;

        lesao.invasaoVascular = lesao.invasaoVascular !== null ?
                        this.trataPresenteAusenteNf(lesao.invasaoVascular) : null;

        return lesao;

    }


}

