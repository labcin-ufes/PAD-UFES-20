import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ImagemService } from '../../../../servicos/imagem.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Guid } from 'guid-typescript';
import Imagem from '../../../../modelo/Imagem';

@Component({
    selector: 'app-auditoria-edicao-imagem',
    templateUrl: './auditoria-edicao-imagem.component.html',
    providers: [
    ]
})
export class AuditoriaEdicaoImagemComponent implements OnInit {

    public imagemCropada: any = '';
    public flagFalha: boolean;
    public imageBase64 = '';
    public numImgSalvas = 0;

    @Input()
    public urlLesao: string;

    @Input()
    public imgParaCrop: any;

    @Input()
    public tipoPac: string;

    @Output()
    public eventoImagemCropada = new EventEmitter<string>();


    constructor (
        private imagemService: ImagemService
    ) {

    }

    ngOnInit () {

        this.imagemService.baixarImagemBase64(this.imgParaCrop.path, this.tipoPac)
        .subscribe (
            (resp) => {
                this.imageBase64 = resp.imagem;
            },
            (erro) => {
                console.log(erro);
                this.flagFalha = true;
            }
        );
    }

    /**
     * Método que pega a imagem cropada quando o usuario muda a região de crop
     * @param event Evento que pega a imagem
     * @author André Pacheco
     */
    public pegaImagemCropada (event: ImageCroppedEvent): void {
        this.imagemCropada = event.base64;
    }

    /**
     * Método utilizado no clique do botão de salvar imagem cropada.
     * No caso ela envia a imagem para o servidor e salva a imagem na lesão desejada
     */
    public salvarImagemCropada (modal: any): void {

        // pegando o cartao do sus no nome da imagem
        const cartaoSus = this.imgParaCrop.path.split('_', 1)[0];
        const nomeImg = cartaoSus + '_' + Guid.create()['value'];
        const imagemSalvar = new Imagem ({'path' : nomeImg });

        // primeiro vamos subir a imagem para o servidor
        this.imagemService.uploadImagemBase64(this.imagemCropada, this.tipoPac, nomeImg)
        .subscribe(
            (resp) => {
                console.log(resp);
                if (resp.estado === 'imagem-salva') {
                    // Agora vamos salvar a imagem no banco

                    if (this.tipoPac === 'dermato') {
                        this.imagemService.salvarImagemDermato(imagemSalvar)
                        .subscribe (
                            (respSalvado) => {
                                // Agora vamos linkar a imagem a lesao
                                this.imagemService.linkarImagemLesao(respSalvado._links.self.href, this.urlLesao)
                                .subscribe (
                                    () => {
                                        modal.hide();
                                        this.numImgSalvas += 1;
                                    },
                                    (erro) => {
                                        console.log(erro);
                                        this.flagFalha = true;
                                        modal.hide();
                                    }
                                );
                            },
                            (erro) => {
                                console.log(erro);
                                this.flagFalha = true;
                                modal.hide();
                            }
                        );
                    } else if (this.tipoPac === 'cirurgia') {
                        this.imagemService.salvarImagemCirurgia(imagemSalvar)
                        .subscribe (
                            (respSalvado) => {
                                // Agora vamos linkar a imagem a lesao
                                this.imagemService.linkarImagemLesao(respSalvado._links.self.href, this.urlLesao)
                                .subscribe (
                                    () => {
                                        modal.hide();
                                        this.numImgSalvas += 1;
                                    },
                                    (erro) => {
                                        console.log(erro);
                                        this.flagFalha = true;
                                        modal.hide();
                                    }
                                );

                            },
                            (erro) => {
                                console.log(erro);
                                this.flagFalha = true;
                                modal.hide();
                            }
                        );
                    }

                } else {
                    this.flagFalha = true;
                    modal.hide();
                }
            },
            (erro) => {
                console.log(erro);
                this.flagFalha = true;
                modal.hide();
            }
        );
    }

    /**
     * Método utilizado no clique do botão de voltar/finalizar a edicao de crop
     * No caso ela exclui a imagem original do servidor e do banco de dados
     */
    public finalizarCrop (modal): void {
        if (this.numImgSalvas > 0) {

            // Apagando imagem do banco e do servidor
            this.imagemService.apagarImagemBanco(this.imgParaCrop._links.self.href)
            .subscribe(
                () => {
                    this.imagemService.apagarImagemServidor(this.imgParaCrop.path, this.tipoPac)
                    .subscribe (
                        () => {
                            this.emiteEventoImagemCropada('crop-finalizado-com-alteracao');
                            modal.hide();
                        },
                        (erro) => {
                            console.log(erro);
                            this.flagFalha = true;
                        }
                    );
                },
                (erro) => {
                    console.log(erro);
                    this.flagFalha = true;
                }
            );

        } else {
            // como nao houve alteração, nao e necessario fazer nada
            this.emiteEventoImagemCropada('crop-finalizado-sem-alteracao');
            modal.hide();
        }
    }

    /**
     * Metodo para emitir o evento da finalização do crop
     * @param msg String com a msg a ser enviada
     */
    public emiteEventoImagemCropada (msg: string) {
        this.eventoImagemCropada.emit(msg);
    }

}
