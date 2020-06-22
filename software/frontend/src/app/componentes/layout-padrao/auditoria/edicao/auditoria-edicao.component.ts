import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LesaoCirurgiaService } from '../../../../servicos/lesao-cirurgia.service';
import { LesaoDermatoService } from '../../../../servicos/lesao-dermato.service';

@Component({
    selector: 'app-auditoria-edicao',
    templateUrl: './auditoria-edicao.component.html',
    providers: [
    ]
  })
export class AuditoriaEdicaoComponent implements OnInit {

  @Input()
  public tipoPac: string;

  @Input()
  public urlLesao: string;

  @Output()
  public eventoRespAuditoriaDeEdicaoPai = new EventEmitter<string>();

  public flagFalha: boolean;

  public lesao: any;
  public lesaoPronta: Promise<boolean>;

  constructor (
    private lesaoCirurgiaService: LesaoCirurgiaService,
    private lesaoDermatoService: LesaoDermatoService
  ) {

  }

  ngOnInit () {
    // console.log(this.urlLesao);
    // console.log(this.tipoPac);
    if (this.tipoPac === 'dermato') {

      this.lesaoDermatoService.obtemLesaoViaUrl(this.urlLesao)
      .subscribe (
        resp => {
          this.lesao = resp;
          this.lesaoPronta = Promise.resolve(true);
        },
        erro => {
          this.flagFalha = true;
        }
      );

    } else if (this.tipoPac === 'cirurgia') {
      this.lesaoCirurgiaService.obtemLesaoViaUrl(this.urlLesao)
      .subscribe (
        resp => {
          this.lesao = resp;
          this.lesaoPronta = Promise.resolve(true);
        },
        erro => {
          console.log(erro);
          this.flagFalha = true;
        }
      );

    }

  }

  /**
   * Método que pega o evento de resposta do filho e encaminha para o pai
   * @param resp String com a resposta
   * @author Andre Pacheco
   */
  public emiteEventoRespAuditoriaDeEdicaoPai (resp: any) {
    this.eventoRespAuditoriaDeEdicaoPai.emit(resp);
  }

  /**
   * Método que pega a resposta da auditoria dada pelo componente filho
   * @param resp String com o a resposta
   * @author André Pacheco
   */
  public pegaEventoRespAuditoriaDeEdicao (resp: any) {
    // console.log('PEGANDO O EVENTO (audit-edicao): ', resp);
    // Emitindo evento para o pai
    this.emiteEventoRespAuditoriaDeEdicaoPai(resp);
  }
}
