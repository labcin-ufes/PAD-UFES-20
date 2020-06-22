import { Component, Input, ViewChild, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AutoCompletarService } from '../../../../servicos/auto-completar.service';
import { ImagemService } from '../../../../servicos/imagem.service';
import { URL_API } from '../../../../utils/url-api';
import LesaoCirurgia from '../../../../modelo/LesaoCirurgia';
import { LesaoCirurgiaService } from '../../../../servicos/lesao-cirurgia.service';
import { RegiaoCorpoService } from '../../../../servicos/regiao-corpo.service';

@Component({
    selector: 'app-auditoria-edicao-cirurgia',
    templateUrl: './auditoria-edicao-cirurgia.component.html',
    providers: [
    ]
})

export class AuditoriaEdicaoCirurgiaComponent implements OnInit {

    @Input()
    public lesao: any;

    @Output()
    public eventoRespAuditoriaDeEdicao = new EventEmitter<string>();

    public imagens: any;
    public url_api = URL_API;
    public cropando: boolean;
    public imgParaCrop: any;

    // funcoes do auto completar
    public completarDiagnostico = this.autoCompletarService.completarDiagnostico;
    public completarRegiao = this.autoCompletarService.completarRegiao;
    public completarLocal = this.autoCompletarService.completarCidade;
    public completarCirurgiao = this.autoCompletarService.completarCirurgiao;
    public completarProcedimento = this.autoCompletarService.completarProcedimento;

    @ViewChild('dadosLesao')
    public dadosLesao: NgForm;

    constructor (
        private autoCompletarService: AutoCompletarService,
        private imagemService: ImagemService,
        private lesaoCirurgiaService: LesaoCirurgiaService,
        private regiaoCorpoService: RegiaoCorpoService ) {

            this.cropando = false;
    }

    // Vai sertar os dados do formulario com os dados recuperados da lesao
    ngOnInit () {
        
       this.buscaGrandeRegiao(this.lesao.regiao);

        this.buscaImagens();
    }


    /**
     * Mapeia uma região anatômica em uma grande região
     * @param regiao região anatômica da lesão
     */
    private buscaGrandeRegiao(regiao: string){

        this.regiaoCorpoService.obtemRegiaoPorNome(regiao)
            .subscribe(
                (resp) => this.lesao.grandeRegiao = resp.parte,
                () => this.lesao.grandeRegiao = "NÃO ENCONTRADO"
            );
    }

    /**
     * Método para buscar as imagens relacionadas a lesao
     */
    private buscaImagens (): void {
        this.imagemService.obtemImagensUrl(this.lesao._links.imagens.href)
        .subscribe (
            resp => {
                this.imagens = resp['_embedded'].imagemCirurgia;
                // console.log(this.imagens);
            }
        );
    }

    /**
     * Função que cancela a auditoria atual e volta para a tela inicial
     * Obs: exclusões não são canceladas, apenas alterações dos dados
     */
    public cancelarAuditoria (): void {
        this.emiteEventoRespAuditoria ('auditoria-cancelada');
    }


    /*
    *
    *Prepara os dados a serem atualizados
    *
    */ 
    public dadosForm(): any{
        const dados = {
            'auditado': this.dadosLesao.value.auditado !== undefined ?
                            this.dadosLesao.value.auditado : null,

            'diagnosticoClinico': this.dadosLesao.value.diagnosticoClinico !== undefined ?
                            this.dadosLesao.value.diagnosticoClinico.toUpperCase() : null,

            'diagnosticoHisto': this.dadosLesao.value.diagnosticoHisto !== undefined ?
                            this.dadosLesao.value.diagnosticoHisto.toUpperCase() : null,

            'regiao': this.dadosLesao.value.regiao !== undefined ?
                            this.dadosLesao.value.regiao.toUpperCase() : null,

            'diametroMaior': this.dadosLesao.value.diametroMaior !== undefined ?
                            this.dadosLesao.value.diametroMaior : null,

            'diametroMenor': this.dadosLesao.value.diametroMenor !== undefined ?
                            this.dadosLesao.value.diametroMenor : null,
            
            'dataProcedimento': this.dadosLesao.value.dataProcedimento !== undefined ?
                            this.dadosLesao.value.dataProcedimento : null,

            'localProcedimento': this.dadosLesao.value.localProcedimento !== undefined ?
                            this.dadosLesao.value.localProcedimento : null,

            'cirurgiao': this.dadosLesao.value.cirurgiao !== undefined ?
                        this.dadosLesao.value.cirurgiao.toUpperCase() : null,

            'procedimento': this.dadosLesao.value.procedimento !== undefined ?
                        this.dadosLesao.value.procedimento.toUpperCase() : null,
                    
            'obs': this.dadosLesao.value.obs !== undefined ?
            this.dadosLesao.value.diagnosticoClinico.toUpperCase() : 'NENHUMA',

            'grandeRegiao': this.dadosLesao.value.grandeRegiao !== undefined ?
            this.dadosLesao.value.grandeRegiao.toUpperCase() : null,

        };
        return dados;
    }

    /**
     * Método para salvar as alterações da auditoria
     * alterado para não apagar os dados do histipatológico
     */
    public salvarAuditoria(): void {
        //let les = new LesaoCirurgia(this.dadosLesao.value);
        // les.setAuditado(true);
        let dados = this.dadosForm();
        this.lesaoCirurgiaService.atualizarLesaoCirurgia(this.lesao._links.self.href, dados)
        .subscribe(
            () => {
                this.emiteEventoRespAuditoria('auditoria-lesao-auditada');
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
    public excluirImagem (img: any, buscar = true, somenteServer = false): void {
        // console.log('Excluir imagem: ', img);

        // apagando a imagem somente no servidor
        if (somenteServer) {

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

        } else {
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
    }

    /**
     * Método para excluir a lesao e suas imagens relacionadas
     */
    public excluirLesao () {
        // console.log('Excluir lesao: ', this.lesao);

        // Primeiro, vamos excluir todas as imagens relacionadas a lesao
        for (const img of this.imagens) {
            this.excluirImagem(img, false, true);
        }

        this.lesaoCirurgiaService.apagarLesao(this.lesao._links.self.href)
        .subscribe(
            () => {
                this.emiteEventoRespAuditoria('auditoria-lesao-excluida');
            },
            (erro) => {
                console.log('Erro exclusao lesao: ', erro);
                this.emiteEventoRespAuditoria('auditoria-falha-excluir-lesao');
            }
        );

        // emitir evento de exclusao
    }

    /**
     * Essa função emite um evento com a url de lesão selecionada ao clicados na tabela de lesoes
     * @author André Pacheco
     * @param url String com a url da lesao
     */
    public emiteEventoRespAuditoria (resp: string): void {
        // console.log ('EMITINDO O EVENTO...', resp);
        this.eventoRespAuditoriaDeEdicao.emit(resp);
    }

    /**
     * Método para pegar o evento que a edicao de imagem emite
     * @param msg String com a msg
     */
    public pegaEventoImagemCropada (msg: any): void {
        // console.log('PEGANDO EVENTO IMAGEM CROPADA: ', msg);

        if (msg === 'crop-finalizado-com-alteracao') {
            // console.log('Buscando imagens pois houve alteração no crop');
            this.buscaImagens ();
            this.cropando = false;
        } else if (msg === 'crop-finalizado-sem-alteracao') {
            this.cropando = false;
        }
    }

    /**
     * Método para mudar a tela para o crop
     */
    public setarCropando (img: any): void {
        this.imgParaCrop = img;
        this.cropando = true;
    }
}
