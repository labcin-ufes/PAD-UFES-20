import { LesaoCirurgiaService } from './../../../../servicos/lesao-cirurgia.service';
import { AutoCompletarService } from './../../../../servicos/auto-completar.service';
import { ActivatedRoute } from '@angular/router';
import { PacienteCirurgiaService } from './../../../../servicos/paciente-cirurgia.service';
import { OnInit, Component, OnChanges, ViewChild } from '@angular/core';
import PacienteCirurgia from '../../../../modelo/PacienteCirurgia';
import { ImagemService } from '../../../../servicos/imagem.service';
import LesaoCirurgia from '../../../../modelo/LesaoCirurgia';
import Utils from '../../../../utils/utils';
import { Guid } from 'guid-typescript';
import Imagem from '../../../../modelo/Imagem';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    selector: 'app-nova-lesao-pac-cir',
    styleUrls: ['./nova-lesao.component.css'],
    templateUrl: './nova-lesao.component.html',
    providers: [ PacienteCirurgiaService ]
  })
export class NovaLesaoComponent  implements OnInit {


    public flagFalhaReqURL: boolean; // caso falhe tudo
    public cartaoSusURL: string; // cartao do sus advindo da URL
    public cartaoSusForm: string; // cartao do sus advindo do formulario
    public paciente: PacienteCirurgia; // paciente recuperado
    public pacienteNaoEncontrado: boolean; // paciente nao ta no banco
    public cartaoSusValido: boolean; // controla se o cartao do sus é valido

    @ViewChild('modalEnviando')
    public modalEnviando: ModalDirective;

    @ViewChild('dadosLesao')
    public dadosLesao: any;

    @ViewChild('inputFile')
    public inputFile: any;

    // funcoes do auto completar
    public completarDiagnostico = this.autoCompletarService.completarDiagnostico;
    public completarRegiao = this.autoCompletarService.completarRegiao;
    public completarLocal = this.autoCompletarService.completarCidade;
    public completarCirurgiao = this.autoCompletarService.completarCirurgiao;
    public completarProcedimento = this.autoCompletarService.completarProcedimento;

    public imgValida: boolean; // controla se a imagem possui os formatos certos

    public url: string; // URL do paciente a ser atualiazado
    public imagensFile: any; // Salva as imagens que são carregadas no input
    public imagens: Imagem[];
    public lesao: LesaoCirurgia; // Salva os dados da lesão a ser enviada
    public imagemEnviada: boolean; // caso tenha dado algum erro no upload setar essa variavel
    public respUsuario: string;
    public cartaoSusDefinido: string;

    constructor (
        private pacienteCirurgiaService: PacienteCirurgiaService,
        private route: ActivatedRoute,
        private autoCompletarService: AutoCompletarService,
        private imagemService: ImagemService,
        private lesaoCirurgiaService: LesaoCirurgiaService
    ) {
        this.flagFalhaReqURL = false;
        this.cartaoSusValido = false;
        this.pacienteNaoEncontrado = false;
        this.paciente = undefined;
        this.imagensFile = undefined;
        this.respUsuario = undefined;
    }

    ngOnInit () {
        const cartaoURL = this.route.snapshot.params['cartaoSus'];

        // checando se o cartão foi passado via URL e se ele é válido
        if (cartaoURL !== undefined) {
            if (cartaoURL.length === 18) {
                this.cartaoSusURL = cartaoURL;
                this.buscarPacViaParam ();
            } else {
                this.cartaoSusURL = 'invalido';
            }
        }
    }


    /**
     * Método para resetar o alerta de paciente não encontrado no banco
     */
    public resetaAlert (): void {
        this.pacienteNaoEncontrado = false;
    }

    /**
     * Método chamado para validar o cartão do sus e liberar o
     * botão para buscá-lo via form
     */
    public validaCartaoSus (): void {
        if (this.cartaoSusForm.length === 18) {
            this.cartaoSusValido = true;
        } else {
            this.cartaoSusValido = false;
        }
    }

    /**
     * @author André Pacheco
     * Método que o botão de buscar chama para buscar o cartão do sus
     */
    public buscarPacViaBotao (): void {
        this.buscaPacCartaoSus(this.cartaoSusForm);
    }
    /**
     * @author André Pacheco
     * Método para buscar o paciente caso ele sejá passado via parametro na URL
     */
    public buscarPacViaParam (): void {
        this.buscaPacCartaoSus(this.cartaoSusURL);
    }

    /**
     * @author André Pacheco
     * Método para buscar no banco o paciente de acordo com o cartao do sus
     * @param cartao String com o cartão do sus
     */
    public buscaPacCartaoSus (cartao: string): void {
        this.cartaoSusDefinido = cartao;
        this.pacienteCirurgiaService.obtemPacCompletoPorCartaoSUS(cartao)
        .subscribe (
            resp => {

                // nesse caso o paciente nao esta cadastrado no banco
                if (resp === null) {
                    this.pacienteNaoEncontrado = true;
                    this.paciente = undefined;
                } else {
                    this.pacienteNaoEncontrado = false;
                    this.paciente = new PacienteCirurgia(resp);
                    console.log(this.paciente);
                }
            },
            erro => {
                if (erro.status === 404 || erro.status === 409) {
                    this.pacienteNaoEncontrado = true;
                    this.paciente = undefined;
                } else {
                    this.flagFalhaReqURL = true;
                }
            }
        );
    }

    /**
     * Método que recebe os dados do formulário e salva a lesão e
     * a imagem para o paciente em questão
     * @author André Pacheco
     */
    public recebeDadosLesao (): void {

        // Modal de envio
        this.modalEnviando.config.backdrop = 'static';
        this.modalEnviando.config.keyboard = false;
        this.modalEnviando.show();

        // preparando os dados da lesão para envio
        const lesPrep = this.preparaLesao(this.dadosLesao.value);
        this.lesao = lesPrep['lesao'];
        this.imagens = lesPrep['imagens'];

        // Fazendo o upload da imagem para o servidor
        if (lesPrep['imagensComNome'].length !== 0) {
            // se houver imagem, ele envia ela e na sequencia ja submente os dados do paciente
            // apos a requisicao
            this.uploadImagensServidor(lesPrep['imagensComNome']);
        } else {
            // se nao houver imagem, manda so os dados do paciente
            this.enviaDadosPaciente();
        }

        this.dadosLesao.reset();
        this.inputFile.nativeElement.value = '';
        this.modalEnviando.hide();
    }

    /**
     * Método para enviar os pacientes para o servidor
     * @author André Pacheco
     */
    private enviaDadosPaciente (): void {
        this.lesao.setPacienteId (this.paciente.id);

        console.log('Lesao a ser salva: ', this.lesao);

        this.lesaoCirurgiaService.salvaLesaoCirurgia(this.lesao)
        .subscribe(
            resp => {
                const urlLesao = resp._links.self.href;
                console.log('dsdadasdsad');
                this.lesaoCirurgiaService.linkarPacienteLesao(urlLesao, this.paciente.id)
                .subscribe(
                    resp2 => {
                        if (this.imagens.length !== 0) {
                            this.salvarImagens(this.imagens, urlLesao);
                        } else {
                            this.respUsuario = 'pac-salvo';
                            // apenas para atualizar os dados do paciente
                            this.buscaPacCartaoSus (this.cartaoSusDefinido);
                        }
                    },
                    erro => this.respUsuario = 'erro-salvar-pac'
                );
            },
            erro => {
                this.respUsuario = 'erro-salvar-pac';
                console.log(erro);
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
                            // apenas para atualizar os dados do paciente
                            this.buscaPacCartaoSus (this.cartaoSusDefinido);
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
                    this.enviaDadosPaciente();

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
     * Método que recebe os dados da lesão do formulário e prepara todo o envio da mesma
     * para o servidor. É criado os nomes para as imagens e preparado o objeto literal
     * de envio
     * @author André Pacheco
     * @param dadosLesao Array de Objeto literal com os dados da lesão advindos do formulario. Esse array tem que ter
     * formato {'arquivo':..., 'nome':...}
     * @returns Um objeto literal com uma Lesão preenchida (já com a imagem) e o array de objeto literal de envio dos dados
     * no formato {'lesao':..., 'imagensComNome':...}
     */
    private preparaLesao (dadosLesao: any): Object {
        // setando a lesão a ser enviada
        const lesao = new LesaoCirurgia (dadosLesao);

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
                    'nome': this.paciente.cartaoSus + '_' + Guid.create()['value'] // cria um nome com id unico
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
        return { 'lesao': lesao, 'imagensComNome': imagensComFileNome, 'imagens': imagensLesao};
    }

    /**
     * Método que recebe os dados da(s) imagens(em) quando o usuário as seleciona
     * no form de submissão
     * @author André Pacheco
     * @param event Evento retornado no momento do envio
     */
    public recebeImagensInput (event: any): void {

        for (const ev of event.target.files) {
            // pegando o time para saber se é uma imagem
            const tipo = ev.type.split('/', 2)[0];
            if (tipo !== 'image') {
                this.imgValida = false;
                break;
            } else {
                this.imgValida = true;
                // verificando se o tamanho passa
                if (ev.size / (1024 * 1024) > 15.5) {
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
}