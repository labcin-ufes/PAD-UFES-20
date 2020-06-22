import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PainelLesoesComponent } from './painel-lesoes.component';

const painelLesoesRoutes: Routes = [
    {
        path: '',
        data: {
            title: 'Painel de lesões'
        },
        component: PainelLesoesComponent
    }
];

@NgModule({
  imports: [ RouterModule.forChild(painelLesoesRoutes) ],
  exports: [ RouterModule ]
})
export class PainelLesoesRoutingModule {}
