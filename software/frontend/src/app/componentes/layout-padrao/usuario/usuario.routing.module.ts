import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NovoUsuarioComponent } from './novo-usuario/novo-usuario.component';
import { VisualizarUsuarioComponent } from './visualizar-usuario/visualizar-usuario.component';
import { AcessoUsuarioGuard } from '../../../guardas/acesso-usuario.guard';

const usuarioRoutes: Routes = [
    {
        path: '',
        data: {
            title: 'Usuário'
        },
        children: [
        {
            path: '',
            redirectTo: 'novo'
        },
        {
            path: 'novo',
            component: NovoUsuarioComponent,
            data: {
                title: 'novo'
            },
            canActivate: [AcessoUsuarioGuard]
        },
        {
            path: 'gerenciar',
            component: VisualizarUsuarioComponent,
            data: {
                title: 'gerenciar'
            },
            canActivate: [AcessoUsuarioGuard]
        },
        {
            path: 'editar',
            component: EditarUsuarioComponent,
            data: {
                title: 'editar'
            }
        }
    ] },
];

@NgModule({
  imports: [ RouterModule.forChild(usuarioRoutes) ],
  exports: [ RouterModule ]
})
export class UsuarioRoutingModule {}
