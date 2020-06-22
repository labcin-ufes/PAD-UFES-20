import { Component } from '@angular/core';
import { ArquivoService } from '../../../../servicos/arquivo.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
    selector: 'app-atualizar-sistema',
    templateUrl: './atualizar-sistema.component.html'
})

export class AtualizarSistemaComponent {

    public jarInvalido: boolean;
    public arquivoJar: any;
    public flagFalha: boolean;
    public enviando: string;
    public urlServer: string;

    constructor (private arquivoService: ArquivoService) {
        this.flagFalha = false;
        this.enviando = 'nao-comecou';
        this.urlServer = 'https://labcin.ufes.br/sade';
    }

    public enviaJar (event: any): void {
        const nomeArq = event.target.files[0].name.split('.');
        if (nomeArq[nomeArq.length - 1] === 'jar') {
            this.jarInvalido = false;
            this.arquivoJar = event.target.files[0];
        } else {
            this.jarInvalido = true;
        }
    }

    public enviarJarBotao (): void {
        this.enviando = '0%';
        this.arquivoService.uploadArquivo(this.arquivoJar, this.urlServer)
        .subscribe(
            (resp) => {

                if (resp.type === HttpEventType.UploadProgress) {
                    const progresso = Math.round(100 * resp.loaded / resp.total);
                    this.enviando = progresso.toString() + '%';
                    console.log('enviado: ', this.enviando);

                }

            },
            (erro) => {
                console.log(erro);
                this.flagFalha = true;
            }
        );
    }
}
