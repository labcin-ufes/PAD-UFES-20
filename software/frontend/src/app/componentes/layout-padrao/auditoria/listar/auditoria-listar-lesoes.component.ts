import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { LesaoCirurgiaService } from '../../../../servicos/lesao-cirurgia.service';
import { PacienteDermatoService } from '../../../../servicos/paciente-dermato.service';
import { PacienteCirurgiaService } from '../../../../servicos/paciente-cirurgia.service';

@Component({
    selector: 'app-auditoria-listar-lesoes',
    templateUrl: './auditoria-listar-lesoes.component.html',
    providers: [
    ]
})
export class AuditoriaListarLesoesComponent implements OnInit, OnChanges {

    @Input()
    public urlLesoes: any;

    @Input()
    public tipoPac: string;

    @Input()
    public respAuditoria: string;

    @Output()
    public eventoLesSelecionada = new EventEmitter<string>();

    @Output()
    public eventoRespListarLesoes = new EventEmitter<string>();

    public flagFalha: boolean;
    public lesoes: any;
    public pacSemLesao: boolean;
    public urlPaciente: string;
    public pacApagado: boolean;

    constructor (
        private lesoesCirurgiaService: LesaoCirurgiaService,
        private lesoesDermatoService: LesaoCirurgiaService,
        private pacienteDermatoService: PacienteDermatoService,
        private pacienteCirurgiaService: PacienteCirurgiaService
    ) {
        this.pacSemLesao = false;
    }

    ngOnInit () {
    }

    ngOnChanges () {

        // console.log('RespAuditoria (listar-lesoes): ', this.respAuditoria);
        this.pacSemLesao = false;
        this.flagFalha = false;
        this.pacApagado = false;

        // Quando ocorrer uma mudança, vamos verificar se urlLesoes foi preenchido. Se sim,
        // vamos carregar a exibição das lesões
        if (this.urlLesoes !== undefined && this.tipoPac === 'cirurgia') {
            this.lesoesCirurgiaService.obtemLesoesPaciente(this.urlLesoes)
            .subscribe (
                resp => {
                    // console.log(resp);
                    this.lesoes = resp['_embedded'].lesaoCirurgia;

                    this.urlPaciente = this.urlLesoes.replace(/\/lesoes/gi, '');

                    if (this.lesoes.length === 0) {
                        this.pacSemLesao = true;
                        // console.log(this.urlPaciente);
                    }

                },
                erro => {
                    this.flagFalha = true;
                }
            );
        } else if (this.urlLesoes !== undefined && this.tipoPac === 'dermato') {
            this.lesoesDermatoService.obtemLesaoViaUrl(this.urlLesoes)
            .subscribe (
                resp => {
                    // console.log(resp);
                    this.lesoes = resp['_embedded'].lesaoDermato;

                    this.urlPaciente = this.urlLesoes.replace(/\/lesoes/gi, '');

                    if (this.lesoes.length === 0) {
                        this.pacSemLesao = true;
                        // console.log(this.urlPaciente);
                    }
                },
                erro => {
                    this.flagFalha = true;
                }
            );
        }
    }

    /**
     * Essa função emite um evento com a url de lesão selecionada ao clicados na tabela de lesoes
     * @author André Pacheco
     * @param url String com a url da lesao
     */
    public emiteLesSelecionado (url: string): void {
        this.eventoLesSelecionada.emit(url);
    }

    /**
     * Essa função emite um evento com a url de lesão selecionada ao clicados na tabela de lesoes
     * @author André Pacheco
     * @param url String com a url da lesao
     */
    public emitEventoRespListarLesoes (resp: string): void {
        this.eventoRespListarLesoes.emit(resp);
    }

    /**
     * Método que exclui um paciente sem lesão
     */
    public excluirPacSemLesao () {

        if (this.tipoPac === 'cirurgia') {
            this.pacienteCirurgiaService.apagarPaciente(this.urlPaciente)
            .subscribe (
                () => {
                    this.pacApagado = true;
                    this.emitEventoRespListarLesoes('paciente-sem-lesao-apagado');
                },
                (erro) => {
                    console.log(erro);
                    this.pacApagado = false;
                    this.flagFalha = true;
                }
            );
        } else if (this.tipoPac === 'dermato') {
            this.pacienteDermatoService.apagarPaciente(this.urlPaciente)
            .subscribe (
                () => {
                    this.pacApagado = true;
                    this.emitEventoRespListarLesoes('paciente-sem-lesao-apagado');
                },
                (erro) => {
                    console.log(erro);
                    this.pacApagado = false;
                    this.flagFalha = true;
                }
            );
        }

    }
}
