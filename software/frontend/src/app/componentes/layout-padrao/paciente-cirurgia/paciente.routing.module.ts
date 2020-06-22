import { NovaLesaoComponent } from './nova-lesao/nova-lesao.component';
import { NovoHistoComponent } from './novo-histo/novo-histo.component';
import { FiltrarPacienteCirurgiaComponent } from './filtrar/filtrar-paciente-cirurgia.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NovoPacienteComponent } from './novo-paciente/novo-paciente.component';
import { VisualizarPacienteComponent } from './visualizar-paciente/visualizar-paciente.component';
import { EditarPacienteComponent } from './editar-paciente/editar-paciente.component';
import { AcessoUsuarioGuard } from '../../../guardas/acesso-usuario.guard';

const pacienteRoutes: Routes = [
    {
        path: '',
        data: {
            title: 'Paciente cirurgia'
        },
        children: [
            {
                path: 'novo-paciente',
                component: NovoPacienteComponent,
                data: { title: 'Novo Paciente' }
            },
            {
                path: 'editar-paciente',
                component: EditarPacienteComponent,
                data: { title: 'Editar Paciente' },
                canActivate: [AcessoUsuarioGuard]
            },
            {
                path: 'editar-paciente/:cartaoSus',
                component: EditarPacienteComponent,
                data: { title: 'Editar Paciente' },
                canActivate: [AcessoUsuarioGuard]
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
                path: 'filtrar-pacientes',
                component: FiltrarPacienteCirurgiaComponent,
                data: {
                    title: 'Filtrar Pacientes'
                }
            },
            {
                path: 'nova-lesao',
                component: NovaLesaoComponent,
                data: {
                    title: 'Nova lesão'
                }
            },
            {
                path: 'nova-lesao/:cartaoSus',
                component: NovaLesaoComponent,
                data: {
                    title: 'Nova lesão'
                }
            },
            {
                path: 'novo-histopatologico',
                component: NovoHistoComponent,
                data: {
                    title: 'Novo histopatológico'
                }
            },
            {
                path: 'novo-histopatologico/:cartaoSus',
                component: NovoHistoComponent,
                data: {
                    title: 'Novo histopatológico'
                }
            }
        ]
    }
];

@NgModule({
  imports: [ RouterModule.forChild(pacienteRoutes) ],
  exports: [ RouterModule ]
})
export class PacienteRoutingModule {}
