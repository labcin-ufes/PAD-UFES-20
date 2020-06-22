import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnaliseDadosHomeComponent } from './home/analise-dados-home.component';



const analiseDadosRoute: Routes = [
    {
        path: '',
        data: {
            title: 'Análise de dados'
        },
        component: AnaliseDadosHomeComponent
    }
];

@NgModule({
  imports: [ RouterModule.forChild(analiseDadosRoute) ],
  exports: [ RouterModule ]
})
export class AnaliseDadosRoutingModule {}
