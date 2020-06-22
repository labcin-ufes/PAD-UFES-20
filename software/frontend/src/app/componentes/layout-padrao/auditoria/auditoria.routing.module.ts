import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuditoriaDermatoComponent } from './dermato/auditoria-dermato.component';
import { AuditoriaCirurgiaComponent } from './cirurgia/auditoria-cirurgia.component';




const auditoriaRoutes: Routes = [
    {
        path: '',
        data: {
            title: 'Auditoria'
        },
        children: [
            {
                path: 'paciente-dermato',
                component: AuditoriaDermatoComponent,
                data: { title: 'Paciente Dermato' }
            },
            {
                path: 'paciente-dermato/:cartaoSus',
                component: AuditoriaDermatoComponent,
                data: { title: 'Paciente Dermato' }
            },
            {
                path: 'paciente-cirurgia',
                component: AuditoriaCirurgiaComponent,
                data: { title: 'Paciente Cirurgia' }
            },
            {
                path: 'paciente-cirurgia/:cartaoSus',
                component: AuditoriaCirurgiaComponent,
                data: { title: 'Paciente Cirurgia' }
            }
        ]
    }
];

@NgModule({
  imports: [ RouterModule.forChild(auditoriaRoutes) ],
  exports: [ RouterModule ]
})
export class AuditoriaRoutingModule {}
