import { Component, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-auditoria-cirurgia',
    templateUrl: './auditoria-cirurgia.component.html',
    providers: [
    ]
})
export class AuditoriaCirurgiaComponent implements OnInit {

    public tipoPac: string;

    public urlLesoesCirurgia: any;

    public urlLesaoCirurgia: any;
    public editando: boolean;
    public respAuditoria: any;
    public respListarLesoes: string;

    constructor () {

    }

    ngOnInit () {
        this.tipoPac = 'cirurgia';
        this.editando = false;
    }

    /**
     * Método que pega a url das lesoes quando clicado no componente filho
     * @param url
     * @author André Pacheco
     */
    public pegaEventoPacSelecionado (url: any) {
        // preenchendo a variavel para passar para o filho que é listar lesoes
        this.urlLesoesCirurgia = url;
        this.respAuditoria = '';
    }

    /**
     * Método que pega a url da lesão quando clicado no componente filho
     * @param url
     * @author André Pacheco
     */
    public pegaEventoLesSelecionada (url: any) {
        // preenchendo a variavel para passar para o filho que é editar lesao
        this.urlLesaoCirurgia = url;
        this.editando = true;
    }

    /**
     * Método que pega uma resposta de listar lesoes
     * @param resp string com os dados da resposta
     * @author André Pacheco
     */
    public pegaEventoRespListarLesoes (resp: string) {
        // console.log('PEGANDO O EVENTO (audit-dermato): ', resp);
        // preenchendo a variavel para passar para o filho que é editar lesao
        this.respListarLesoes = resp;
    }

    /**
     * Método que pega a resposta da auditoria dada pelo componente filho
     * @param resp String com o a resposta
     * @author André Pacheco
     */
    public pegaEventoRespAuditoriaDeEdicaoPai (resp: any) {
        // console.log('PEGANDO O EVENTO (audit-cirurgia): ', resp);
        // preenchendo a variavel para passar para o filho que é editar lesao
        this.editando = false;
        this.respAuditoria = resp;
    }

}
