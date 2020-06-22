import { Component, OnInit } from '@angular/core';

import { PacienteCirurgiaService } from './../../../../servicos/paciente-cirurgia.service';
import { LesaoCirurgiaService } from '../../../../servicos/lesao-cirurgia.service';
import { ImagemService } from '../../../../servicos/imagem.service';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html'
})
export class WidgetsComponent implements OnInit {

  public currentDate = new Date();

  public numPacienteCirurgia;
  public numLesaoCirurgia;
  public numImagensCirurgia;
  public numLesoesSemHisto;

  constructor(
    private pacienteCirurgiaService: PacienteCirurgiaService,
    private lesaoCirurgiaService: LesaoCirurgiaService,
    private imagemService: ImagemService
    ) {
    this.numPacienteCirurgia = '---';
    this.numLesaoCirurgia = '---';
    this.numImagensCirurgia = '---';
    this.numLesoesSemHisto = '---';
  }

  ngOnInit() {
    this.obtemDadosWidgets();
  }

/**
 * Método que retorna informações gerais para serem apresentadas nos widgets
 *
 * @memberof WidgetsComponent
 */

  obtemDadosWidgets(): void {

    this.pacienteCirurgiaService.obtemPacientesCirurgia ()
    .subscribe(
      resp => this.numPacienteCirurgia = resp.page.totalElements,
      () => this.numPacienteCirurgia = '---'
    );

    this.lesaoCirurgiaService.obtemLesao()
    .subscribe(
      resp => this.numLesaoCirurgia = resp.page.totalElements,
      () => this.numLesaoCirurgia = '---'
    );

    this.imagemService.obtemImagens()
    .subscribe(
      resp => this.numImagensCirurgia = resp.page.totalElements,
      () => this.numImagensCirurgia = '---'
    );

    this.lesaoCirurgiaService.obtemLesoesSemHisto()
    .subscribe(
      resp => this.numLesoesSemHisto = resp._embedded.lesaoCirurgia.length,
      () => this.numLesoesSemHisto = '---'
    );

  }

}
