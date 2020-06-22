import { Component, OnInit, OnChanges } from '@angular/core';

@Component({
    selector: 'app-auditoria-dermato',
    templateUrl: './auditoria-dermato.component.html',
    providers: [
    ]
  })
export class AuditoriaDermatoComponent implements OnInit, OnChanges {

    public tipoPac: string;
    public urlLesoesDermato: any;
    public urlLesaoDermato: any;

    public editando: boolean;

    public respAuditoria: any;

    public respListarLesoes: string;

    constructor () {

    }

    ngOnInit () {
        this.tipoPac = 'dermato';
        this.editando = false;
    }

    ngOnChanges () {
        
    }

    /**
     * Método que pega a url das lesoes quando clicado no componente filho
     * @param url
     * @author André Pacheco
     */
    public pegaEventoPacSelecionado (url: any) {
        // preenchendo a variavel para passar para o filho que é listar lesoes
        this.urlLesoesDermato = url;
        this.respAuditoria = '';
    }

    /**
     * Método que pega a url da lesão quando clicado no componente filho
     * @param url
     * @author André Pacheco
     */
    public pegaEventoLesSelecionada (url: any) {
        // preenchendo a variavel para passar para o filho que é editar lesao
        this.urlLesaoDermato = url;
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
        // console.log('PEGANDO O EVENTO (audit-dermato): ', resp);
        // preenchendo a variavel para passar para o filho que é editar lesao
        this.editando = false;
        this.respAuditoria = resp;
        console.log("Change: ", this.respAuditoria);
    }
}
