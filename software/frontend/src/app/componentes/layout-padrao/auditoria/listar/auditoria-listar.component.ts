import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { PacienteCirurgiaService } from '../../../../servicos/paciente-cirurgia.service';
import { PacienteDermatoService } from '../../../../servicos/paciente-dermato.service';


@Component({
    selector: 'app-auditoria-listar',
    templateUrl: './auditoria-listar.component.html',
    providers: [
    ]
})
export class AuditoriaListarComponent implements OnInit, OnChanges {

    @Input()
    public tipoPac: string;

    @Output()
    public eventoPacSelecionado = new EventEmitter<string>();

    @Input()
    public respAuditoria: string;

    @Input()
    public respListarLesoes: string;

    public flagFalha: boolean;

    public pacientes: any;

    public pacSelecionado: any;


    // atributos para paginancao
    public itensPorPag: number; // Define quantos elementos serao retornados por paginas
    public totalItens: number; // Total de itens a ser exibidos na tabela
    public paginaAtual: number; // página atualmente selecionada
    public maxPagLinks: number; // maximo de links que a pagina pode exibir (os boxes com os numeros)
    public totalPaginas: number; // numero de paginas que a consulta retorna

    constructor (
        private pacienteCirurgiaService: PacienteCirurgiaService,
        private pacienteDermatoService: PacienteDermatoService
        ) {

        // atributos paginacao
        this.itensPorPag = 5;
        this.maxPagLinks = 10;
        this.paginaAtual = 1;
    }

    ngOnInit () {
        // this.tipoPac = 'cirurgia';
        // console.log(this.tipoPac);
        this.buscaPaciente();
    }

    ngOnChanges () {
        // console.log('RespAuditoria (listar): ', this.respAuditoria);
        // console.log('RespListarLesoes (listar): ', this.respListarLesoes);

        if (this.respListarLesoes === 'paciente-sem-lesao-apagado') {
            this.buscaPaciente();
        }
    }

    private buscaPaciente (): void {
        if (this.tipoPac === 'cirurgia') {
            this.pacienteCirurgiaService.obtemNaoAuditados(this.paginaAtual - 1,
                this.itensPorPag)
            .subscribe(
                resp => {
                    // console.log(resp);
                    this.pacientes = resp['_embedded'].pacienteCirurgia;

                    this.totalItens = resp['page'].totalElements;
                    this.totalPaginas = resp['page'].totalPages;
                },
                () => {
                    this.flagFalha = true;
                }
            );
        } else if (this.tipoPac === 'dermato') {
            this.pacienteDermatoService.obtemNaoAuditados(this.paginaAtual - 1,
                this.itensPorPag)
            .subscribe(
                resp => {
                    // console.log(resp);
                    this.pacientes = resp['_embedded'].pacienteDermato;

                    this.totalItens = resp['page'].totalElements;
                    this.totalPaginas = resp['page'].totalPages;
                },
                () => {
                    this.flagFalha = true;
                }
            );
        } else {
            this.flagFalha = true;
        }
    }

  /**
   * Método para identificar a mudança da página ao clicar no botão
   * @param event Captura o evento realizado. Com ele é possível pegar
   * valores como a página selecionada
   */
  public mudaPagina(event: any): void {
    // Altera a página quando clicado no link
    this.paginaAtual = event.page;
    // sempre que o usuario trocar a pagina, pegamos a nova pagina dos dados
    this.buscaPaciente();
  }

  /**
   * Essa função emite um evento com a url das lesões do pacientes clicados na tabela de pacientes
   * @author André Pacheco
   * @param url String com a url da lesao
   */
  public emitePacSelecionado (paciente: any): void {
    const url = paciente._links.lesoes.href;
    this.pacSelecionado = paciente;
    this.eventoPacSelecionado.emit(url);
  }

  /**
   * Método para marcar o paciente como auditado
   * @param url String com a url do paciente
   * @author André Pacheco
   */
  public marcarComoAuditado (url: string): void {

    // console.log('URL :', url);
    if (this.tipoPac === 'cirurgia') {
        this.pacienteCirurgiaService.atualizaAuditado(url, true)
        .subscribe(
            () => {
                this.buscaPaciente()
                this.respAuditoria = "paciente-checked"
            },
            (erro) => this.flagFalha = true
        );
    } else if (this.tipoPac === 'dermato') {

        console.log("marcarComoAuditado:", this.tipoPac, url)

        this.pacienteDermatoService.atualizaAuditado(url, true)
        .subscribe(
            () => {
                this.buscaPaciente()
                this.respAuditoria = "paciente-checked"
            },
            (erro) => this.flagFalha = true
        );
    }
  }

}
