import { URL_API } from './../../../../../utils/url-api';
import { Component, Input, Output, AfterViewInit, EventEmitter } from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise, map } from 'rxjs/operators';
import { ImagemService } from '../../../../../servicos/imagem.service';

@Component({
    selector: 'app-canvas',
    templateUrl: 'canvas.component.html',
    styleUrls: [ 'canvas.component.css' ]
})

export class CanvasComponent implements AfterViewInit {

    @Input() public imagemUrl: string;
    @Input() public imagemId: number;
    @Input() public imagemPath: string;
    @Input() public tipoPaciente: string;
    @Output() public eventoCancelarSegmentacao = new EventEmitter<void>();

    private cx_seg: CanvasRenderingContext2D;
    private cx_res: CanvasRenderingContext2D;
    public imgDim;
    public respUsuario;

    constructor(
        private imagemService: ImagemService
    ) {
        this.imgDim = undefined;
        this.respUsuario = undefined;
    }

    public ngAfterViewInit() {
        // Apenas remove o '.png' do Path, já que o formato é adicionado automaticamente
        // no upload do serviço de imagem.
        let idx = this.imagemPath.indexOf('.png');
        if (idx !== -1) {
            this.imagemPath = this.imagemPath.substring(0, idx);
        }

        // Obtem as dimensoes da imagem original
        const imagem = new Image();
        imagem.src = this.imagemUrl;
        imagem.onload = () => {
            this.imgDim = {
                largura: imagem.naturalWidth,
                altura: imagem.naturalHeight
            };
        };

        // Cria os canvas de segmentacao e resultado
        const canvas_seg = <HTMLCanvasElement> document.getElementById('img_seg');
        canvas_seg.width = window.innerWidth * 0.35;
        canvas_seg.height = canvas_seg.width;

        const canvas_res = <HTMLCanvasElement> document.getElementById('img_res');
        canvas_res.width = window.innerWidth * 0.35;
        canvas_res.height = canvas_res.width;

        // Inicia propriedades do canvas de segmentação
        this.cx_seg = canvas_seg.getContext('2d');
        this.cx_seg.lineWidth = 2;
        this.cx_seg.lineCap = 'round';
        this.cx_seg.strokeStyle = 'white';

        // Inicia propriedades do canvas resultado
        this.cx_res = canvas_res.getContext('2d');
        this.cx_res.fillStyle = 'white';
        this.cx_res.fillRect(0, 0, canvas_res.width, canvas_res.height);

        // Carrega a imagem da mascara, se existir, para o canvas_res
        let mask = new Image();
        mask.crossOrigin = "anonymous";
        idx = this.imagemUrl.indexOf(this.tipoPaciente) + this.tipoPaciente.length;
        mask.onload = () => {
            this.cx_res.drawImage(mask, 0, 0, mask.naturalWidth, mask.naturalHeight,
                                        0, 0, canvas_res.width, canvas_res.height);
        };
        mask.src = this.imagemUrl.substring(0, idx) + '-mask' + this.imagemUrl.substring(idx);

        // Única ferramenta implementada por enquanto
        this.ferramentaMaoLivre(canvas_seg);
    }

    /**
    * Ferramenta de segmentação baseada em Free Hand,
    * MouseDown para iniciar a segmentação e MouseUp para encerrar.
    * @author Guilherme Esgario
    */
    private ferramentaMaoLivre(canvas_seg) {
        let initPos;

        // Captura os eventos de 'mousedown'
        fromEvent(canvas_seg, 'mousedown')
        .pipe(
            switchMap((e) => {
            initPos = undefined;
            // Ao apertar o mouse os dados são gravados na imagem formando a curva da máscara
            return fromEvent(canvas_seg, 'mousemove')
                .pipe(
                    // Vai parar (e unsubscribe) uma vez que o usuário liberar o mouse
                    // logo dispara o evento 'mouseup'
                    takeUntil(fromEvent(canvas_seg, 'mouseup').pipe(
                        map( () => {
                            // Completa a curva
                            this.cx_seg.closePath();
                            this.cx_seg.stroke();

                            this.cx_seg.fillStyle = 'white';
                            this.cx_seg.fill();

                            // Apaga tudo do canvas resultado
                            this.cx_res.clearRect(0, 0, canvas_seg.width, canvas_seg.height);
                            this.cx_res.fillStyle = 'black';
                            this.cx_res.fillRect(0, 0, canvas_seg.width, canvas_seg.height);

                            // Copia contorno do canvas segmentação para o resultado
                            this.cx_res.drawImage(canvas_seg, 0, 0);

                            // Apaga tudo do canvas segmentação
                            this.cx_seg.clearRect(0, 0, canvas_seg.width, canvas_seg.height);
                        } )
                    )),
                    pairwise()
                );
            })
        )
        .subscribe((res: [MouseEvent, MouseEvent]) => {
            const rect = canvas_seg.getBoundingClientRect();

            // Posição anterior e atual com offset
            const posAnterior = {
            x: res[0].clientX - rect.left,
            y: res[0].clientY - rect.top
            };

            const posAtual = {
            x: res[1].clientX - rect.left,
            y: res[1].clientY - rect.top
            };

            if (initPos === undefined) {
                initPos = posAnterior;
                this.cx_seg.beginPath();
                this.cx_seg.moveTo(initPos.x, initPos.y);
            }

            // Este método efetivamente cria as linhas no canvas
            this.desenharNoCanvas(posAnterior, posAtual);
        });
    }

    private desenharNoCanvas(posAnterior: { x: number, y: number }, posAtual: { x: number, y: number }) {
        if (!this.cx_seg) { return; }

        if (posAnterior) {
            this.cx_seg.lineTo(posAtual.x, posAtual.y);
            this.cx_seg.stroke();
        }
    }

    public cancelarSegmentacao(): void {
        this.eventoCancelarSegmentacao.emit();
    }

    /**
    * Obtem a máscara gerada e envia pro servidor em formato base64
    * @author Guilherme Esgario
    */
    public salvarMascara(): void {
        // Exibe mensagem de espera
        this.respUsuario = 'salvar-mascara-aguarde';

        // Canvas da máscara gerada
        const canvas_res = <HTMLCanvasElement> document.getElementById('img_res');

        // Cria um canvas para copiar e redimensionar a imagem
        let canvas_copy = document.createElement('canvas');
        let ctx = canvas_copy.getContext('2d');

        canvas_copy.width = this.imgDim.largura;
        canvas_copy.height = this.imgDim.altura;
        ctx.drawImage(canvas_res, 0, 0, this.imgDim.largura, this.imgDim.altura);
        const imagemPng = canvas_copy.toDataURL();

        // Corrigir o imagemPath, remover .png
        this.imagemService.uploadImagemBase64(imagemPng, this.tipoPaciente + '-mask', this.imagemPath).subscribe(
            resp => {
                console.log('Resposta imagem upload: ' + resp.estado);
                this.respUsuario = 'salvar-mascara-ok';

                // Seta a coluna segmentado para True
                let url: string;
                if (this.tipoPaciente === 'dermato') {
                    url = URL_API + '/api/imagemDermato/' + this.imagemId;
                } else {
                    url = URL_API + '/api/imagemCirurgia/' + this.imagemId;
                }
                console.log(url);
                const dados = { 'segmentado': true };
                this.imagemService.atualizarImagem(url, dados).subscribe(
                    resp => {
                        console.log('Tabela atualizada corretamente.');
                    },
                    erro => {
                        console.log('Erro ao atualizar tabela imagem.');
                    }
                );
            },
            erro => {
                if (erro.status === 500) {
                    console.log("Error 500");
                }
                this.respUsuario = 'salvar-mascara-erro';
            }
        );
    }
}
