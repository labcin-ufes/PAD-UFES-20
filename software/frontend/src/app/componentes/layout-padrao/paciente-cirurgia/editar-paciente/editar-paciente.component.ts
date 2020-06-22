import { EditarLesaoComponent } from './editar-lesao/editar-lesao.component';
import { URL_API } from './../../../../utils/url-api';
import { LesaoCirurgiaService } from '../../../../servicos/lesao-cirurgia.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteCirurgiaService } from '../../../../servicos/paciente-cirurgia.service';
import { OnInit, Component, ViewChild } from '@angular/core';
import PacienteCirurgia from '../../../../modelo/PacienteCirurgia';
import { ImagemService } from '../../../../servicos/imagem.service';
import LesaoCirurgia from '../../../../modelo/LesaoCirurgia';
import { Guid } from 'guid-typescript';
import Imagem from '../../../../modelo/Imagem';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    selector: 'app-editar-pac-cir',
    styleUrls: ['./editar-paciente.component.css'],
    templateUrl: './editar-paciente.component.html',
    providers: [ PacienteCirurgiaService, EditarLesaoComponent ]
  })
export class EditarPacienteComponent  implements OnInit {


    public flagFalhaReqURL: boolean; // caso falhe tudo
    public cartaoSusURL: string; // cartao do sus advindo da URL
    public cartaoURL: string; // cartao do sus advindo da URL
    public cartaoSusForm: string; // cartao do sus advindo do formulario
    public paciente: PacienteCirurgia; // paciente recuperado
    public pacResp: any = null; // Paciente no formato da resposta do GET
    public pacienteNaoEncontrado: boolean; // paciente nao ta no banco

    @ViewChild('dadosLesao')
    public dadosLesao: any;

    @ViewChild('modalExcluirPac')
    public modalExcluirPac: ModalDirective;

    @ViewChild('modalLesao')
    public modalLesao: ModalDirective;
    public lesaoAtual: LesaoCirurgia = null;
    public lesaoEditada: any = null;

    public imgValida: boolean; // controla se a imagem possui os formatos certos

    public url: string; // URL do paciente a ser atualiazado
    public imagensFile: any; // Salva as imagens que são carregadas no input
    public imagens: Imagem[];
    public lesao: LesaoCirurgia; // Salva os dados da lesão a ser enviada
    public imagemEnviada: boolean; // caso tenha dado algum erro no upload setar essa variavel
    public respUsuario: string;
    public cartaoSusDefinido: string;

    // Flags
    public editarInfos = false;
    public editarLesoes = false;

    public url_api: any = URL_API;

    constructor (
        private pacienteCirurgiaService: PacienteCirurgiaService,
        private route: ActivatedRoute,
        private lesaoCirurgiaService: LesaoCirurgiaService,
        private router: Router,
        private imagemService: ImagemService,
        private edLesComp: EditarLesaoComponent,
    ) {
        this.flagFalhaReqURL = false;
        this.pacienteNaoEncontrado = false;
        this.paciente = undefined;
        this.imagensFile = undefined;
        this.respUsuario = undefined;
    }

    ngOnInit () {
        console.log('inicio');
        this.cartaoURL = this.route.snapshot.params['cartaoSus'];
        this.editarInfos = false;
        this.editarLesoes = false;

        // checando se o cartão foi passado via URL e se ele é válido
        if (this.cartaoURL !== undefined) {
            if (this.cartaoURL.length === 18) {
                this.cartaoSusURL = this.cartaoURL;
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
        this.pacienteCirurgiaService
          .obtemPorCartaoSUS(cartao)
          .subscribe(
            resp => {
              // nesse caso o paciente nao esta cadastrado no banco
              if (resp === null) {
                this.pacienteNaoEncontrado = true;
                this.paciente = undefined;
              } else {
                this.pacienteNaoEncontrado = false;
                this.paciente = new PacienteCirurgia(resp);
                this.lesaoCirurgiaService
                .obtemLesoesPaciente(resp._links.lesoes.href)
                .subscribe(
                    resp2 => {
                        this.paciente.lesoes = resp2._embedded.lesaoCirurgia;
                    },
                    erro2 => {
                        console.log(erro2);
                    }
                );
                this.pacResp = resp;
                console.log('Paciente resposta: ', this.pacResp);
                console.log('Paciente cirurgia: ', this.paciente);
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
     * Método para exibir modal com imagens de lesao
     * @author Gabriel G
     * @param lesao Lesao a ser visualizada
     */
    public exibeModal (lesao: any): void {
        this.lesaoAtual = new LesaoCirurgia(lesao);
        this.imagemService
        .obtemImagensUrl(lesao._links.imagens.href)
        .subscribe(
            resp => {
                console.log(resp);
                this.lesaoAtual.setImagens(resp._embedded.imagemCirurgia);
                this.modalLesao.show();
            },
            erro => {
                if (erro.status === 404 || erro.status === 409) {
                    this.flagFalhaReqURL = true;
                }
            }
        );
    }

    /**
     * Método para exibir modal com imagens de lesao
     * @author Gabriel G
     * @param lesao Lesao a ser editada
     */
    public editarLesao (lesao: any): void {
        this.lesaoEditada = lesao;
        this.editarLesoes = true;
    }

    /**
     * Método para alterar a rota
     * @author Gabriel G
     */
    public changeRoute (sus: string): void {
        console.log('evento');
        console.log(sus);
        this.router.navigate(['/dashboard/paciente-cirurgia/editar-paciente', sus]);
    }

    /**
     * Método para pegar o evento informando a alteração do paciente
     * @author Gabriel G
     * @param sus sus do paciente alterado
     */
    public pegaEventoPacAlterado (sus: string): void {
        console.log('EVENTO PEGO');
        this.cartaoURL = sus;
        this.editarInfos = false;
        this.editarLesoes = false;

        // checando se o cartão foi passado via URL e se ele é válido
        if (this.cartaoURL !== undefined) {
            if (this.cartaoURL.length === 18) {
                this.cartaoSusURL = this.cartaoURL;
                this.buscarPacViaParam ();
            } else {
                this.cartaoSusURL = 'invalido';
            }
        }
    }

    /**
     * Método para pegar o evento informando o tipo da edição
     * @author Gabriel G
     * @param resp tipo da resposta
     */
    public pegaEventoRespEdicao(resp: any): void {
        console.log('Pegando evento:', resp);
        if (resp === 'auditoria-cancelada') {
            this.editarLesoes = false;
            this.lesaoEditada = null;
        } else if (resp === 'auditoria-lesao-excluida') {
            this.pacienteCirurgiaService.atualizaSincronizar(this.pacResp._links.self.href, true);
            this.editarLesoes = false;
            this.lesaoEditada = null;
            this.buscarPacViaParam();
        } else if (resp === 'auditoria-lesao-auditada') {
            console.log('Paciente auditado: ', this.pacResp._links.self.href);
            this.pacienteCirurgiaService.atualizaSincronizar(this.pacResp._links.self.href, true);
            this.editarLesoes = false;
            this.lesaoEditada = null;
            this.buscarPacViaParam();
        } else if (resp === 'imagem-excluida') {
            console.log('Imagem excluida: ', this.pacResp._links.self.href);
            this.pacienteCirurgiaService.atualizaSincronizar(this.pacResp._links.self.href, true);
        }
    }

    /**
     * Método para excluir o paciente sendo editado
     * @author Gabriel G
     */
    public excluirPaciente () {
        console.log('Excluir paciente: ', this.paciente);

        // Primeiro, vamos excluir todas as lesões relacionadas ao paciente
        let imagens: any;
        for (const les of this.paciente.lesoes) {
            console.log('Excluindo lesao: ', les);
            this.imagemService.obtemImagensUrl(les['_links'].imagens.href)
                .subscribe(
                    resp => {
                        imagens = resp['_embedded'].imagemCirurgia;
                        console.log('Buscando imagem', imagens);
                        if (imagens !== undefined) {
                            console.log('Excluindo imagens da lesao');
                            for (const img of imagens) {
                                this.imagemService.apagarImagemServidor(img.path, 'cirurgia')
                                    .subscribe(
                                        // se deu tudo certo, atualiza as imagens
                                        () => {
                                            console.log('Imagens deletadas');
                                        },
                                        (erro) => {
                                            console.log('Erro na exclusão da imagem: ', erro);
                                        }
                                    );
                            }
                        } else {
                            console.log('Lesao sem imagens');
                        }
                    },
                    (erro) => {
                        console.log('Erro buscar imagem: ', erro);
                    }
                );
            // this.lesaoCirurgiaService.apagarLesao(les['_links'].self.href)
            // .subscribe(
            //     () => {
            //         console.log('lesao-excluida');
            //     },
            //     (erro) => {
            //         console.log('Erro exclusao lesao: ', erro);
            //     }
            // );
        }

        this.pacienteCirurgiaService.apagarPaciente(this.pacResp._links.self.href)
            .subscribe(
                () => {
                    console.log('paciente-excluido');
                    this.modalExcluirPac.hide();
                    this.router.navigate(['/dashboard/paciente-cirurgia/editar-paciente']);
                },
                (erro) => {
                    console.log('Erro exclusao paciente: ', erro);
                }
            );

        // emitir evento de exclusao
    }
}
