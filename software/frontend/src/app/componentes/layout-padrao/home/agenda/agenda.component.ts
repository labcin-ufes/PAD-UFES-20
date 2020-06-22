import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AgendaService } from '../../../../servicos/agenda.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html'
})
export class AgendaComponent implements OnInit {

  /**
   * @Output que emite o retorno para o componente pai 'Home'
   * qndo não conseguir se comunicar com o servidor
   */
  @Output() flagFalha = new EventEmitter();

  agenda = [];

  constructor(private agendaService: AgendaService) { }

  ngOnInit() {
    this.obtemAgenda();
  }

  obtemAgenda(): void {
    this.agendaService.obtemAgenda()
    .subscribe(
      resp => {
          this.agenda = resp._embedded.agenda;
      },
      () => {
        this.flagFalha.emit(true);
      }
    );
  }

}
