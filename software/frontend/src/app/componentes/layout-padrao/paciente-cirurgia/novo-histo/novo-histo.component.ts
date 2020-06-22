import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { PacienteCirurgiaService } from '../../../../servicos/paciente-cirurgia.service';
import { LesaoCirurgiaService } from './../../../../servicos/lesao-cirurgia.service';
import { AutoCompletarService } from './../../../../servicos/auto-completar.service';


@Component({
  selector: 'app-novo-histo',
  templateUrl: './novo-histo.component.html',
  styleUrls: ['./novo-histo.component.css'],
  providers: [PacienteCirurgiaService]
})

export class NovoHistoComponent implements OnInit {
    // Esse decorador permite recuperar os dados do formulario no template html
    @ViewChild('dadosCadastroForm')

    public dadosCadastroForm: NgForm;
    public lesoesSemHisto: any[] = [] ; // aonde serao salvas as lesoes sem histopatologico;
    public nomePaciente: String;
    public numLesoes: Number = 1;
    public cartaoSusForm: string;
    public contLesoes: number;
    public cartaoSusURL: string;
    public linkLesaoUrl: string;
    public diagnosticoCliAtual: string;
    public regiaoAtual: string;
    public cartaoSUS: string;

    // flags para controle de divs
    public flagFalhaReq: boolean;
    public possuiLesao: boolean;
    public possuiLesaoSemHisto: boolean;
    public lesaoSelecionada: boolean; // boolean para verificar se alguma lesão da tabela foi selecionada para cadastro
    public lesaoAtualizada: boolean;
    public lesaoEnviada: boolean;
    public isRequisicaoURL: boolean;
    public cartaoSusValido: boolean;
    public pacienteNaoEncontrado: boolean;
    public isMelanoma: boolean;
    public isCarcinomaEspin: boolean;
    public isCarcinomaBaso: boolean;
    public isNovoPaciente: boolean;
    public isMargemProfundaLivre: boolean;
    public isMargemLateralLivre: boolean;

    // funcoes do auto completar
    public completarDiagnostico = this.autoCompletarService.completarDiagnostico;
    public completarSubtipoHisto = this.autoCompletarService.completarSubtipoHisto;



    public constructor(
        private pacienteCirurgiaService: PacienteCirurgiaService,
        private route: ActivatedRoute,
        private lesaoCirurgiaService: LesaoCirurgiaService,
        private autoCompletarService: AutoCompletarService,
        ) {
            this.possuiLesao = false;
            this.isMelanoma = false;
            this.isCarcinomaBaso = false;
            this.isCarcinomaEspin = false;
            this.possuiLesaoSemHisto = true;
            this.lesaoSelecionada = false;
            this.lesaoAtualizada = true;
            this.cartaoSusValido = false;
            this.lesaoEnviada = false;
            this.isRequisicaoURL = false;
            this.isNovoPaciente = true;
            this.isMargemLateralLivre = false;
            this.isMargemProfundaLivre = false;
          }

    ngOnInit(): void {
        const cartaoURL = this.route.snapshot.params['cartaoSus'];

        // checando se o cartão foi passado via URL e se ele é válido
        if (cartaoURL !== undefined) {
            this.isRequisicaoURL = true;
            if (cartaoURL.length === 18) {
                this.cartaoSusURL = cartaoURL;
                this.cartaoSusValido = true;
                this.buscarPacienteURL();
            } else {
                this.cartaoSusURL = 'invalido';
                this.cartaoSusValido = false;
                this.possuiLesaoSemHisto = false;

             }
        }
        console.log(this.cartaoSusValido);
        console.log(this.cartaoSusURL);
    }

    /**
   * @author Breno K
   * Método para receber os dados da lesao com valores do histopatologico
   */
    public recebeCadastroForm(): void {

       const dados = {
        'diagnosticoHisto': this.dadosCadastroForm.value.diagnosticoHistopatologico.toUpperCase(),

        'subtipoHisto': this.dadosCadastroForm.value.subtipoHistopatologico !== undefined ?
                            this.dadosCadastroForm.value.subtipoHistopatologico.toUpperCase() : null,

        'clark': this.dadosCadastroForm.value.clark !== undefined ?
                    this.dadosCadastroForm.value.clark.toUpperCase() : null,

        'limiteRessecao': this.dadosCadastroForm.value.limiteRessecao !== undefined ?
                    this.dadosCadastroForm.value.limiteRessecao.toUpperCase() : null,

        'infiltracaoPerineural': this.dadosCadastroForm.value.infiltracaoPerineural !== undefined ?
                            this.dadosCadastroForm.value.infiltracaoPerineural.toUpperCase() : null,

        'infiltracaoAngiolinfatica': this.dadosCadastroForm.value.infiltracaoAngiolinfatica !== undefined ?
                                    this.dadosCadastroForm.value.infiltracaoAngiolinfatica.toUpperCase() : null,

        'tipoTumor': this.dadosCadastroForm.value.tipoTumor !== undefined ?
                        this.dadosCadastroForm.value.tipoTumor.toUpperCase() : null,

        'breslow': this.dadosCadastroForm.value.breslow !== undefined ?
                    this.dadosCadastroForm.value.breslow : null,

        'tamanhoTumorDimMaior': this.dadosCadastroForm.value.tamanhoTumorDimMaior !== undefined ?
                        this.dadosCadastroForm.value.tamanhoTumorDimMaior : null,

        'tamanhoTumorDimMenor': this.dadosCadastroForm.value.tamanhoTumorDimMenor !== undefined ?
                                this.dadosCadastroForm.value.tamanhoTumorDimMenor : null,

        'crescimentoRadial': this.dadosCadastroForm.value.crescimentoRadial !== undefined ?
                                this.dadosCadastroForm.value.crescimentoRadial.toUpperCase() : null,

        'crescimentoVertical': this.dadosCadastroForm.value.crescimentoVertical !== undefined ?
                                this.dadosCadastroForm.value.crescimentoVertical.toUpperCase() : null,

        'indiceMiotico': this.dadosCadastroForm.value.indiceMiotico !== undefined ?
                            this.dadosCadastroForm.value.indiceMiotico : null,

        'infiltradoLinfocito': this.dadosCadastroForm.value.infiltradoLinfocito !== undefined ?
                        this.dadosCadastroForm.value.infiltradoLinfocito.toUpperCase() : null,

        'ulceracao': this.dadosCadastroForm.value.ulceracao !== undefined ?
                        this.dadosCadastroForm.value.ulceracao.toUpperCase() : null,

        'lesaoSatelite':  this.dadosCadastroForm.value.lesaoSatelite !== undefined ?
                            this.dadosCadastroForm.value.lesaoSatelite.toUpperCase() : null,

        'evidenciaRegressao':  this.dadosCadastroForm.value.evidenciaRegressao !== undefined ?
                                this.dadosCadastroForm.value.evidenciaRegressao.toUpperCase() : null,

        'associacaoNevoMelanocito': this.dadosCadastroForm.value.associacaoNevoMelanocito !== undefined ?
                                    this.dadosCadastroForm.value.associacaoNevoMelanocito.toUpperCase() : null,

        'margemCirurgiaProfunda': this.dadosCadastroForm.value.margemCirurgiaProfunda !== undefined ?
                                    this.dadosCadastroForm.value.margemCirurgiaProfunda.toUpperCase() : null,

        'margemCirurgiaLateral': this.dadosCadastroForm.value.margemCirurgiaLateral !== undefined ?
                                    this.dadosCadastroForm.value.margemCirurgiaLateral.toUpperCase() :  null,

        'invasaoVascular': this.dadosCadastroForm.value.invasaoVascular !== undefined ?
                            this.dadosCadastroForm.value.invasaoVascular.toUpperCase() : null,

        'menorDistMargemRessecaoLateral': this.dadosCadastroForm.value.menorDistMargemRessecaoLateral !== undefined ?
                                            this.dadosCadastroForm.value.menorDistMargemRessecaoLateral : null,

        'margemProfundaLivre': this.dadosCadastroForm.value.margemProfundaLivre !== undefined ?
                                    this.dadosCadastroForm.value.margemProfundaLivre.toUpperCase() : null,

        'margemLateralLivre': this.dadosCadastroForm.value.margemLateralLivre !== undefined ?
                                    this.dadosCadastroForm.value.margemLateralLivre.toUpperCase() : null,

        'tamTumor': this.dadosCadastroForm.value.tamTumor !== undefined ?
                        this.dadosCadastroForm.value.tamTumor : null

       };
       console.log(dados);
       this.atualizaLesao(dados);
    }

    /**
     * @author Breno K
     * @param lesaoURL url da lesao a ser atualizada com dados histopatológicos
     * método habilita vizualizacao do form histopatológico e seta o link da lesao atual
     */
    public cadastrarHisto(diag: string, regiao: string, lesaoURL: string): void {
        this.linkLesaoUrl = lesaoURL;
        this.diagnosticoCliAtual = diag;
        this.regiaoAtual = regiao;
        this.lesaoSelecionada = true;
        this.lesaoAtualizada = true;
    }


    public validaCartaoSus(): void {
        if (this.cartaoSusForm.length === 18) {
            this.cartaoSusValido = true;
        } else {
            this.cartaoSusValido = false;
        }
    }

    public buscarPacienteCartao(): void {
        this.pacienteNaoEncontrado = false;
        this.possuiLesaoSemHisto = true;
        this.isNovoPaciente = true;
        this.cartaoSUS = this.cartaoSusForm;
        this.buscarPaciente(this.cartaoSusForm);
    }

    public buscarPacienteURL(): void {
        this.buscarPaciente(this.cartaoSusURL);
    }

    /**
     * @author Breno K
     * @param dados dados a serem atualizados
     * Método que atualiza os dados histopatológicos da lesão
     */
    public atualizaLesao(dados: any): void {
        console.log(this.isRequisicaoURL);
        console.log(this.linkLesaoUrl);
        console.log(dados);
        this.lesaoCirurgiaService.atualizarLesaoCirurgia(this.linkLesaoUrl, dados).subscribe(
            resp => {
                 console.log('cadastrado');
                 this.dadosCadastroForm.resetForm();
                 this.lesaoSelecionada = false;
                 this.lesoesSemHisto = this.lesoesSemHisto.filter(obj => obj._links.self.href !== this.linkLesaoUrl);
                 this.linkLesaoUrl = undefined;
                 this.lesaoEnviada = true;
                 this.isMelanoma = false;
                 this.isCarcinomaBaso = false;
                 this.isCarcinomaEspin = false;
                 this.dadosCadastroForm.resetForm();
                 if (this.lesoesSemHisto.length === 0) {this.possuiLesaoSemHisto = false; }
             },
            erro => {
                console.log( 'erro caastro: ' + erro);
                this.lesaoAtualizada = false;
                this.lesaoEnviada = false;
                this.lesaoSelecionada = false;
                this.isMelanoma = false;
                this.dadosCadastroForm.resetForm();
            }
        );
    }

    /**
     * @author Breno k
     * @param urlLesoesPaciente url com todas as lesoes do paciente
     * Método que busca todas as lesões do paciente e salva as lesões sem histopatológico
     */
    /*public buscarLesoes(urlLesoesPaciente: string): void {
        this.lesaoCirurgiaService.obtemLesoesPaciente(urlLesoesPaciente).subscribe(
            respLesoes => {
                let index = 0;
                while (index < respLesoes._embedded.lesaoCirurgia.length) {
                    this.possuiLesao = true;
                    if ( respLesoes._embedded.lesaoCirurgia[index].diagnosticoHisto === null) {
                        this.possuiLesaoSemHisto = true;
                        const dados = {
                            'nomePaciente': this.nomePaciente,
                            'diagnosticoClinico': respLesoes._embedded.lesaoCirurgia[index].diagnosticoClinico,
                            'regiao': respLesoes._embedded.lesaoCirurgia[index].regiao,
                            'linkLesao': respLesoes._embedded.lesaoCirurgia[index]._links.self.href
                        };
                        this.lesoesSemHisto.push(dados);

                    }
                    index++;
                    if (this.lesoesSemHisto.length === 0) { this.possuiLesaoSemHisto = false; }
                }
            },
            erroLesoes => {
                this.flagFalhaReq = true;
            }
        );

    }*/

    /**
     * @param urlLesoesPaciente url com todas as lesoes do paciente
     * Método que busca todas as lesões do paciente e salva as lesões sem histopatológico
     * @author Breno k
     */
    public buscarLesoes(idPac: number): void {
        this.lesaoCirurgiaService.obtemLesoesSemHistoPorPaciente(idPac)
        .subscribe (
            (resp) => {
                this.lesoesSemHisto = resp._embedded.lesaoCirurgia;
                if (this.lesoesSemHisto.length === 0) {
                    this.possuiLesaoSemHisto = false;
                } else {
                    this.possuiLesaoSemHisto = true;
                }
            },
            (erro) => {
                console.log(erro);
                this.flagFalhaReq = true;
            }
        );
    }

    /**
   * @author Breno K
   * @param cartao cartão sus do paciente
   * Método para buscar paciente e suas lesoes através de cartao do sus
   */
    public buscarPaciente(cartao: string): void {
        this.pacienteCirurgiaService.obtemPorCartaoSUS(cartao).subscribe(
            resp => {
                if (this.nomePaciente === resp.nomeCompleto) {
                    this.isNovoPaciente = false;
                }

                this.nomePaciente = resp.nomeCompleto;

                // pegando o id do paciente da url do mesmo
                const sepDados = resp._links.self.href.split('/');
                const idPac = sepDados[sepDados.length - 1];
                this.flagFalhaReq = false;

                if (this.isNovoPaciente) {
                    this.buscarLesoes(idPac);
                }
            },
            erro => {
                if (erro.status === 404 || erro.status === 409) {
                    this.pacienteNaoEncontrado = true;
                    this.possuiLesaoSemHisto = false;
                } else {
                    this.flagFalhaReq = true;
                }
            }
        );

    }

    /**
   * @author Breno K
   * Método para mostrar inputs de melanoma
   */
    public opcoesMelanoma(): void {
        const diagnostico: string = ((<HTMLInputElement>document.getElementById('diagnostico')).value);
        if (diagnostico.includes('melanoma') || diagnostico.includes('MELANOMA')) {
            this.isMelanoma = true;
            this.isCarcinomaEspin = false;
            this.isCarcinomaBaso = false;
        } else if (diagnostico.includes('carcinoma espinocelular') || diagnostico.includes('CARCINOMA ESPINOCELULAR')) {
            this.isCarcinomaEspin = true;
            this.isCarcinomaBaso = false;
            this.isMelanoma = false;
        } else if (diagnostico.includes('carcinoma basocelular') || diagnostico.includes('CARCINOMA BASOCELULAR')) {
            this.isCarcinomaBaso = true;
            this.isCarcinomaEspin = false;
            this.isMelanoma = false;
        } else {
            this.isCarcinomaEspin = false;
            this.isCarcinomaBaso = false;
            this.isMelanoma = false;
        }
    }

    /**
     * verificaMargemLateral método utilizado para mostrar um input extra
     * para margem cirurgia lateral de resultado livre
     */
    public ativaMargemLateral(): void {
        console.log('texto qualquer');
        this.isMargemLateralLivre = true;
        console.log(this.isMargemLateralLivre);
    }


    /**
     * verificaMargemProfunda método utilizado para mostrar um input extra
     * para margem cirurgia profunda de resultado livre
     */
    public ativaMargemProfunda(): void {
        console.log('texto qualquer');
        this.isMargemProfundaLivre = true;
        console.log(this.isMargemProfundaLivre);
    }


    /**
     * verificaMargemProfunda método utilizado para escodner input extra
     * para margem cirurgia profunda
     */
    public desativaMargemProfunda(): void {
        console.log('texto qualquer');
        this.isMargemProfundaLivre = false;
        console.log(this.isMargemProfundaLivre);
    }


    /**
     * verificaMargemLateral método utilizado para esconder input extra
     * para margem cirurgia lateral
     */
    public desativaMargemLateral(): void {
        console.log('texto qualquer');
        this.isMargemLateralLivre = false;
        console.log(this.isMargemLateralLivre);
    }
}
