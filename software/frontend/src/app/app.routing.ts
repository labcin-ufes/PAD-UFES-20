import { PoliticaPrivacidadeComponent } from './componentes/politica-privacidade/politica-privacidade.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutPadraoComponent } from './componentes/layout-padrao/layout-padrao.component';
import { LoginComponent } from './componentes/layout-login/login/login.component';
import { LayoutLoginComponent } from './componentes/layout-login/layout-login.component';
import { CadastroUsuarioLoginComponent } from './componentes/layout-login/cadastro-usuario-login/cadastro-usuario-login.component';
import { AcessoUsuarioGuard } from './guardas/acesso-usuario.guard';
import { P404Component } from './componentes/404/404.component';
import { TermosDeUsoComponent } from './componentes/termos-de-uso/termos-de-uso.component';

export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
      path: 'login',
      component: LayoutLoginComponent,
      children: [
        {
          path: '',
          component: LoginComponent
        },
        {
          path: 'cadastro-usuario',
          component: CadastroUsuarioLoginComponent
        }
      ]
  },
  {
    path: '404',
    component: P404Component
  },
  {
    path: 'termos-de-uso',
    component: TermosDeUsoComponent
  },
  {
    path: 'politica-privacidade',
    component: PoliticaPrivacidadeComponent
  },
  {
      path: 'dashboard',
      component: LayoutPadraoComponent,
      children: [
        {
          path: '',
          loadChildren: './componentes/layout-padrao/home/home.module#HomeModule'
        },
        {
          path: 'usuario',
          loadChildren: './componentes/layout-padrao/usuario/usuario.module#UsuarioModule'
        },
        {
          path: 'paciente-cirurgia',
          loadChildren: './componentes/layout-padrao/paciente-cirurgia/paciente.module#PacienteModule'
        },
        {
          path: 'dermato',
          loadChildren: './componentes/layout-padrao/paciente-dermato/dermato.module#DermatoModule',
          canActivate: [AcessoUsuarioGuard]
        },
        {
          path: 'visualizar-lesoes',
          loadChildren: './componentes/layout-padrao/painel-lesoes/painel-lesoes.module#PainelLesoesModule'
        },
        {
          path: 'auditoria',
          loadChildren: './componentes/layout-padrao/auditoria/auditoria.module#AuditoriaModule',
          canActivate: [AcessoUsuarioGuard]
        },
        {
          path: 'analise-dados',
          loadChildren: './componentes/layout-padrao/analise-dados/analise-dados.module#AnaliseDadosModule'
        },
        {
          path: 'extra',
          loadChildren: './componentes/layout-padrao/extra/extra.module#ExtraModule',
          canActivate: [AcessoUsuarioGuard]
        }
      ]
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(ROUTES) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
