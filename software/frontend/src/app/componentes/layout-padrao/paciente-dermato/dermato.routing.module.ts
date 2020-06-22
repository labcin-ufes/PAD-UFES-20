import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NovoPacienteComponent } from './novo-paciente/novo-paciente.component';
import { NovaLesaoDermatoComponent } from './nova-lesao/nova-lesao-dermato.component';
import { VisualizarPacienteComponent } from './visualizar-paciente/visualizar-paciente.component';
import { PainelLesoesDermatoComponent } from './painel-lesoes-dermato/painel-lesoes-dermato.component';
import { EstatisticasDermato } from './estatisticas/estatistica-dermato.component';

const DermatoRoutes: Routes = [
    {
        path: '',
        data: {
            title: 'Paciente Dermatologia'
        },
        children: [
            {
                path: '',
                redirectTo: 'novo-paciente'
            },
            {
                path: 'novo-paciente',
                component: NovoPacienteComponent,
                data: {
                    title: 'Novo Paciente'
                }
            },
            {
                path: 'nova-lesao',
                component: NovaLesaoDermatoComponent,
                data: {
                    title: 'Nova lesão'
                }
            },
            {
                path: 'nova-lesao/:cartaoSus',
                component: NovaLesaoDermatoComponent,
                data: {
                    title: 'Nova lesão'
                }
            },
            {
                path: 'visualizar-paciente',
                component: VisualizarPacienteComponent,
                data: { title: 'Visualizar Paciente' }
            },
            {
                path: 'visualizar-paciente/:cartaoSus',
                component: VisualizarPacienteComponent,
                data: { title: 'Visualizar Paciente' }
            },
            {
                path: 'painel-lesoes',
                component: PainelLesoesDermatoComponent,
                data: {
                    title: 'Painel de lesões'
                }
            },
            {
                path: 'estatisticas',
                component: EstatisticasDermato,
                data: {
                    title: 'Estatísticas dermato'
                }
            }
        ]
    }
];


@NgModule({
  imports: [ RouterModule.forChild(DermatoRoutes) ],
  exports: [ RouterModule ]
})
export class DermatoRoutingModule {}
