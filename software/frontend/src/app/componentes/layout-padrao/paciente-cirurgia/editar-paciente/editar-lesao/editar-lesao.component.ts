import { Component, Input, ViewChild, OnInit, EventEmitter, Output, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AutoCompletarService } from '../../../../../servicos/auto-completar.service';
import { ImagemService } from '../../../../../servicos/imagem.service';
import { URL_API } from '../../../../../utils/url-api';
import LesaoCirurgia from '../../../../../modelo/LesaoCirurgia';
import { LesaoCirurgiaService } from '../../../../../servicos/lesao-cirurgia.service';
import { ModalDirective } from 'ngx-bootstrap';
import { Guid } from 'guid-typescript';
import Imagem from '../../../../../modelo/Imagem';

@Component({
    selector: 'app-editar-lesao',
    templateUrl: './editar-lesao.component.html',
    styleUrls: ['./editar-lesao.component.css'],
    providers: [
    ]
})

export class EditarLesaoComponent implements OnInit, OnChanges {

    @Input()
    public lesao: any;
    @Input()
    public sus: string;

    @Output()
    public eventoRespEdicao = new EventEmitter<string>();

    @ViewChild('modalConfirmarEdicao')
    public modalConfirmarEdicao: ModalDirective;

    @ViewChild('modalExcluir')
    public modalExcluir: ModalDirective;

    public imagens: any;

    public url_api = URL_API;

    // funcoes do auto completar
    public completarDiagnostico = this.autoCompletarService.completarDiagnostico;
    public completarRegiao = this.autoCompletarService.completarRegiao;
    public completarLocal = this.autoCompletarService.completarCidade;
    public completarCirurgiao = this.autoCompletarService.completarCirurgiao;
    public completarProcedimento = this.autoCompletarService.completarProcedimento;

    public imgValida: boolean; // controla se a imagem possui os formatos certos
    public respUsuario: string;
    public imagensFile: any; // Salva as imagens que são carregadas no input
    public imagemEnviada: boolean; // caso tenha dado algum erro no upload setar essa variavel
    public flagFalhaReqURL = false; // caso falhe tudo

    public isMelanoma: boolean;
    public isCarcinomaEspin: boolean;
    public isCarcinomaBaso: boolean;
    public isMargemProfundaLivre: boolean;
    public isMargemLateralLivre: boolean;
    // funcoes do auto completar
    public completarSubtipoHisto = this.autoCompletarService.completarSubtipoHisto;

    @ViewChild('dadosLesao')
    public dadosLesao: NgForm;

    constructor (
        private autoCompletarService: AutoCompletarService,
        private imagemService: ImagemService,
        private lesaoCirurgiaService: LesaoCirurgiaService ) {


    }

    // Vai setar os dados do formulario com os dados recuperados da lesao
    ngOnInit () {
        console.log('Lesao a ser editada: ', this.lesao);
        this.initOpcoes();
        this.buscaImagens();
    }

    ngOnChanges() {
        console.log('Recarregando lesao:', this.lesao);
        this.initOpcoes();
        this.buscaImagens();
    }

    /**
     * Método para buscar as imagens relacionadas a lesao
     */
    private buscaImagens (): void {
        this.imagemService.obtemImagensUrl(this.lesao._links.imagens.href)
        .subscribe (
            resp => {
                this.imagens = resp['_embedded'].imagemCirurgia;
            }
        );
    }

    /**
     * Função que cancela a auditoria atual e volta para a tela inicial
     * Obs: exclusões não são canceladas, apenas alterações dos dados
     */
    public cancelarEdicao (): void {
        this.emiteEventoRespEdicao ('auditoria-cancelada');
    }

    /**
     * Método para salvar as alterações da edição
     */
    public salvarEdicao(): void {
        this.modalConfirmarEdicao.hide();
        const les = new LesaoCirurgia(this.dadosLesao.value);
        const lesPrep = this.preparaLesao();
        this.imagens = lesPrep['imagens'];

        // Fazendo o upload da imagem para o servidor
        if (lesPrep['imagensComNome'].length !== 0) {
            // se houver imagem, ele envia ela e na sequencia ja submente os dados do paciente
            // apos a requisicao
            this.uploadImagensServidor(lesPrep['imagensComNome']);
        }
        this.lesaoCirurgiaService.atualizarLesaoPUT(les, this.lesao._links.self.href)
        .subscribe(
            () => {
                this.emiteEventoRespEdicao('auditoria-lesao-auditada');
            },
            (erro) => {
                console.log('Erro ao atualizar lesao: ', erro);
            }
        );
    }

    /**
     * Método para excluir a imagem do banco e do server
     * @param img Imagem a ser excluida
     */
    public excluirImagem (img: any, buscar = true): void {
        console.log('Excluir imagem: ', img);
        this.emiteEventoRespEdicao('imagem-excluida');

        // Primeiro, apagando imagem do banco de dados
        this.imagemService.apagarImagemBanco(img._links.self.href)
        .subscribe (
            // se deu tudo certo, apaga no servidor
            () => {
        this.imagemService.apagarImagemServidor (img.path, 'cirurgia')
        .subscribe (
            // se deu tudo certo, atualiza as imagens
            () => {
                if (buscar) {
                    this.buscaImagens();
                }
            },
            (erro) => {
                console.log('Erro na exclusão da imagem: ', erro);
            }
        );
            },
            (erro) => {
                console.log('Erro na exclusão da imagem: ', erro);
            }
        );
    }

    /**
     * Método para excluir a lesao e suas imagens relacionadas
     */
    public excluirLesao () {
        console.log('Excluir lesao: ', this.lesao);
        this.emiteEventoRespEdicao('auditoria-lesao-auditada');

        // Primeiro, vamos excluir todas as imagens relacionadas a lesao
        for (const img of this.imagens) {
            this.imagemService.apagarImagemServidor(img.path, 'cirurgia')
                .subscribe(
                    // se deu tudo certo, atualiza as imagens
                    () => {
                        console.log('Imagem excluida: ', img.path);
                    },
                    (erro) => {
                        console.log('Erro na exclusão da imagem: ', erro);
                    }
                );
        }

        this.lesaoCirurgiaService.apagarLesao(this.lesao._links.self.href)
        .subscribe(
            () => {
                this.emiteEventoRespEdicao('auditoria-lesao-excluida');
            },
            (erro) => {
                console.log('Erro exclusao lesao: ', erro);
                this.emiteEventoRespEdicao('auditoria-falha-excluir-lesao');
            }
        );

        // emitir evento de exclusao
    }

    /**
     * Essa função emite um evento com a url de lesão selecionada ao clicados na tabela de lesoes
     * @author André Pacheco
     * @param url String com a url da lesao
     */
    public emiteEventoRespEdicao (resp: string): void {
        console.log ('EMITINDO O EVENTO...', resp);
        this.eventoRespEdicao.emit(resp);
    }

    /**
     * Método que recebe os dados da(s) imagens(em) quando o usuário as seleciona
     * no form de submissão
     * @author André Pacheco
     * @param event Evento retornado no momento do envio
     */
    public recebeImagensInput(event: any): void {

        for (const ev of event.target.files) {
            // pegando o time para saber se é uma imagem
            const tipo = ev.type.split('/', 2)[0];
            if (tipo !== 'image') {
                this.imgValida = false;
                break;
            } else {
                this.imgValida = true;
                // verificando se o tamanho passa
                if (ev.size / (1024 * 1024) > 6.5) {
                    this.imgValida = false;
                    this.respUsuario = 'imagem-grande';
                    break;
                }
            }
        }

        // se todas forem válidas, a lista é preenchida, caso contrário, muda pra undefined
        if (this.imgValida) {
            this.imagensFile = event.target.files;
        } else {
            this.imagensFile = undefined;
        }
    }

    /**
     * Método que recebe os dados da lesão do formulário e prepara todo o envio da mesma
     * para o servidor. É criado os nomes para as imagens e preparado o objeto literal
     * de envio
     * @author André Pacheco
     * formato {'arquivo':..., 'nome':...}
     * @returns Um objeto literal com uma Lesão preenchida (já com a imagem) e o array de objeto literal de envio dos dados
     * no formato {'lesao':..., 'imagensComNome':...}
     */
    private preparaLesao (): Object {
        // Esse array vai guardar a imagem e o nome dela
        const imagensComFileNome = new Array<Object>();

        // Criando o array de imagem para colocar na lesão
        const imagensLesao = new Array<Imagem>();
        // setando imagens, caso tenha sido submetidas
        if (this.imgValida && this.imagensFile !== undefined) {
            for (const imgF of this.imagensFile) {
                // montando o objeto que será mandando para o serviço de envio da imagem
                const dadosImg = {
                    'arquivo': imgF,
                    'nome': this.sus + '_' + Guid.create()['value'] // cria um nome com id unico
                };
                // Inserindo a imagem no array que vai para o envio
                imagensComFileNome.push(dadosImg);

                // Criando o tipo imagem que vai para dentro de lesão
                const imgLes = new Imagem ();
                imgLes.setPath(dadosImg.nome);
                // Inserindo a imagem no array que vai para o envio
                imagensLesao.push(imgLes);
            }
            // Colocando o vetor de imagens dentro de lesão
            // lesao.setImagens(imagensLesao);
        }
        return { 'imagensComNome': imagensComFileNome, 'imagens': imagensLesao};
    }

    /**
     * Método que realiza o upload das imagens no servidor.
     * @param dadosImg Array de objeto literal contendo os arquivos das imagens e o nome delas gerados
     * @author André Pacheco
     */
    private uploadImagensServidor (dadosImg: Object[]): void {
        this.imagemService.uploadImagem(dadosImg, 'cirurgia')
        .subscribe(
            resp => {
                console.log('Resposta imagem upload: ' + resp.estado);
                if (resp.estado === 'imagem-salva') {
                    this.imagemEnviada = true;
                    // se deu tudo certo, agora o paciente é atualizado
                    // Essa atualização tem que ser feita aqui dentro por conta
                    // de sincronia das operações
                    const urlLesao = this.lesao._links.self.href;
                    this.salvarImagens(this.imagens, urlLesao);

                } else {
                    this.respUsuario = 'erro-salvar-pac';
                    this.flagFalhaReqURL = true;
                }
            },
            erro => {
                if (erro.status === 500) {
                    this.respUsuario = 'imagem-muito-grande';
                }
                this.flagFalhaReqURL = true;
            }
        );
    }

    /**
     * Método para salvar uma ou mais imagens no servidor
     * @author André Pacheco
     */
    private salvarImagens (imagens: Imagem[], urlLesao: string): void {

        for (const img of imagens) {

            this.imagemService.salvarImagemCirurgia(img)
            .subscribe(
                resp => {
                    const urlImg = resp._links.self.href;
                    this.imagemService.linkarImagemCirurgiaLesao(urlImg, urlLesao)
                    .subscribe(
                        () => {
                            this.respUsuario = 'pac-salvo';
                        },
                        () => {
                            this.respUsuario = 'erro-salvar-pac';
                        }
                    );
                },
                () => this.respUsuario = 'erro-salvar-pac'
            );
        }

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

     /**
   * @author Gabriel G
   * Método para mostrar inputs de melanoma
   */
    public initOpcoes(): void {
        const diagnostico: string = this.lesao.diagnosticoHisto;

        if (this.lesao.margemCirurgiaLateral === 'LIVRE') {
            this.isMargemLateralLivre = true;
        } else {
            this.isMargemLateralLivre = false;
        }

        if (this.lesao.margemCirurgiaProfunda === 'LIVRE') {
            this.isMargemProfundaLivre = true;
        } else {
            this.isMargemProfundaLivre = false;
        }

        if (diagnostico !== null && diagnostico !== undefined) {

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
    }
}
