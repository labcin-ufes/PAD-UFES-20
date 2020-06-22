import { Component, OnInit, ViewChild } from '@angular/core';
import { PacienteCirurgiaService } from '../../../../servicos/paciente-cirurgia.service';
import { PacienteDermatoService } from '../../../../servicos/paciente-dermato.service';
import { SincronizadorService } from '../../../../servicos/sincronizador.service';
import { ModalDirective } from 'ngx-bootstrap';
import { HttpEventType } from '@angular/common/http';


@Component({
    selector: 'app-sicronizacao',
    templateUrl: './sincronizacao.component.html'
})

export class SicronizacaoComponent implements OnInit {

    public flagFalha: boolean;
    public numPacCirSinc: number;
    public numPacDerSinc: number;
    public sincronizando: string;
    public urlServer: string;

    @ViewChild('modalLocal')
    public modalLocal: ModalDirective;

    @ViewChild('modalRemoto')
    public modalRemoto: ModalDirective;

    public valorEnviadoBanco: string;

    public valorEnviadoImagens: string;

    constructor (
        private pacienteCirurgiaService: PacienteCirurgiaService,
        private pacienteDermatoService: PacienteDermatoService,
        private sincronizadorService: SincronizadorService) {
        this.flagFalha = false;
        this.sincronizando = 'nao-comecou';
        this.urlServer = 'https://labcin.ufes.br/sade';
        // this.urlServer = 'http://localhost:8080';
        this.valorEnviadoBanco = '0%';
        this.valorEnviadoImagens = '0%';
    }

    ngOnInit () {
        this.obtemPacientesNaoSincronizados();
    }

    private obtemPacientesNaoSincronizados (): void {
        this.pacienteCirurgiaService.obtemNaoSicronizados()
        .subscribe(
            (resp) => {
                console.log(resp);
                this.numPacCirSinc = resp;
            }
        );

        this.pacienteDermatoService.obtemNaoSicronizados()
        .subscribe(
            (resp) => {
                console.log(resp);
                this.numPacDerSinc = resp;
            }
        );
    }

    /**
     * Método chamado no click do botao de sincronizar o servidor Local. Primeiramente chama a sincronização das imagens.
     * Quando essa requisicao acabar ela chama a copia do banco.
     */
    public sincronizacaoLocal (): void {

        this.modalLocal.hide();
        this.sincronizacaoImagensLocal();

    }

    /**
     * Método utilizado para sincronização do banco de dados Local. Ele é chamado após a finalização da requisição da sincronização
     * das imagens do servidor local
     */
    private sincronizacaoBancoLocal (): void {
        this.sincronizando = 'sincronizando-local';
        this.sincronizadorService.atualizarBancoServerLocal(this.urlServer)
        .subscribe (
            (resp) => {

                if (resp.type === HttpEventType.UploadProgress) {
                    const progresso = Math.round(100 * resp.loaded / resp.total);
                    this.valorEnviadoBanco = progresso.toString() + '%';
                    console.log('enviado: ', this.valorEnviadoBanco);

                    if (this.valorEnviadoBanco === '100%') {
                        // atualizando os valores dos pacientes
                        this.obtemPacientesNaoSincronizados();
                    }

                }
            },
            (erro) => {
                console.log(erro);
                this.flagFalha = true;
            }
        );
    }

    /**
     * Método utilizado para sincronização das imagens do servidor local. Quando ela acaba, ela chama a sincronização do banco local
     */
    private sincronizacaoImagensLocal (): void {
        this.sincronizando = 'sincronizando-local';
        this.sincronizadorService.atualizarImagensServerLocal(this.urlServer)
        .subscribe (
            (resp) => {

                if (resp.type === HttpEventType.UploadProgress) {
                    const progresso = Math.round(100 * resp.loaded / resp.total);
                    this.valorEnviadoImagens = progresso.toString() + '%';
                    console.log('enviado imagens: ', this.valorEnviadoImagens);

                    if (this.valorEnviadoImagens === '100%') {
                        // Quando acabar de sincronizar as imagens, chama a sincronização do banco
                        this.sincronizacaoBancoLocal();
                    }

                }
            },
            (erro) => {
                console.log(erro);
                this.flagFalha = true;
            }
        );
    }

    /**
     * Método chamado no click do botao de sincronizar o servidor remoto. Primeiramente chama a sincronização das imagens.
     * Quando essa requisicao acabar ela chama a copia do banco.
     */
    public sincronizacaoRemoto (): void {
        this.modalRemoto.hide();
        this.sincronizacaoImagensRemoto();
    }

    /**
     * Método utilizado para sincronização do banco de dados remoto. Ele é chamado após a finalização da requisição da sincronização
     * das imagens do servidor remoto
     */
    private sincronizacaoBancoRemoto (): void {
        this.sincronizando = 'sincronizando-remoto';
        this.sincronizadorService.atualizarBancoServerRemoto(this.urlServer)
        .subscribe (
            (resp) => {

                if (resp.type === HttpEventType.UploadProgress) {
                    const progresso = Math.round(100 * resp.loaded / resp.total);
                    this.valorEnviadoBanco = progresso.toString() + '%';
                    console.log('enviado: ', this.valorEnviadoBanco);

                    if (this.valorEnviadoBanco === '100%') {
                        // atualizando os valores dos pacientes
                        this.obtemPacientesNaoSincronizados();
                    }

                }
            },
            (erro) => {
                console.log(erro);
                this.flagFalha = true;
            }
        );
    }

    /**
     * Método utilizado para sincronização das imagens do servidor remoto. Quando ela acaba, ela chama a sincronização do banco remoto
     */
    private sincronizacaoImagensRemoto (): void {
        this.sincronizando = 'sincronizando-remoto';
        this.sincronizadorService.atualizarImagensServerRemoto(this.urlServer)
        .subscribe (
            (resp) => {

                if (resp.type === HttpEventType.UploadProgress) {
                    const progresso = Math.round(100 * resp.loaded / resp.total);
                    this.valorEnviadoImagens = progresso.toString() + '%';
                    console.log('enviado: ', this.valorEnviadoImagens);

                    if (this.valorEnviadoImagens === '100%') {
                        // Quando acabar de sincronizar as imagens, chama a sincronização do banco
                        this.sincronizacaoBancoRemoto();
                    }

                }
            },
            (erro) => {
                console.log(erro);
                this.flagFalha = true;
            }
        );
    }

}

