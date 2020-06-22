import { Component, OnInit } from '@angular/core';
import { PacienteDermatoService } from '../../../../servicos/paciente-dermato.service';
import { LesaoDermatoService } from '../../../../servicos/lesao-dermato.service';
import { ImagemService } from '../../../../servicos/imagem.service';
import { ChartsModule } from 'ng2-charts';


@Component({
  selector: 'app-estatistica-dermato',
  templateUrl: './estatistica-dermato.component.html',
  styleUrls: ['./estatistica-dermato.component.css'],
})
export class EstatisticasDermato implements OnInit {

  public flagFalha = false;
  public numPacientes: number;
  public numLesoes: number;
  public numImagens: number;

  public diagAgrupadas: any;

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    title: {
      text: 'Número de lesões por diagnóstico',
      display: true
    }
  };
  // public barChartLabels: Array<string>; // = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType = 'bar';
  public barChartLegend = true;
  // public barChartData: Array<Object>;
  public barChartData = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'}
    
  ];

  public chartColors: any[] = [
    { 
      backgroundColor:"#1e66bd"
    }];

  constructor (
    private pacienteDermatoService: PacienteDermatoService,
    private lesaoDermatoService: LesaoDermatoService,
    private imagemService: ImagemService
    ) {

  }

  ngOnInit () {
    this.pacienteDermatoService.obtemTodos(1,0).subscribe(
      (resp) => this.numPacientes = resp.page.totalElements,
      () => this.flagFalha = true
    );

    this.lesaoDermatoService.obtemTodos(1,0).subscribe(
      (resp) => this.numLesoes = resp.page.totalElements,
      () => this.flagFalha = true
    );

    this.imagemService.obtemTodasImagensDermato(1,0).subscribe(
      (resp) => this.numImagens = resp.page.totalElements,
      () => this.flagFalha = true
    );

    this.pacienteDermatoService.statsDiagAgrupado().subscribe(
      (resp) => {
        
        let diags = [];
        let scores = [];
        // this.barChartLabels = 
        this.diagAgrupadas = resp.slice(0, 15)
        
        for (let d of this.diagAgrupadas){
          diags.push(d[0])
          scores.push(d[1])
        }

        this.barChartLabels = diags;
        this.barChartData[0].data = scores;
        this.barChartData[0].label = "Diagnosticos";
      }
    );

  }

}
