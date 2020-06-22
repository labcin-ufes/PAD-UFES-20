import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { PopoverModule } from 'ngx-bootstrap/popover';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';
import { LoginComponent } from './componentes/layout-login/login/login.component';

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Importing modal
import { ModalModule } from 'ngx-bootstrap/modal';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { LayoutPadraoComponent } from './componentes/layout-padrao/layout-padrao.component';
import { CadastroUsuarioLoginComponent } from './componentes/layout-login/cadastro-usuario-login/cadastro-usuario-login.component';
import { LayoutLoginComponent } from './componentes/layout-login/layout-login.component';
import { AcessoUsuarioGuard } from './guardas/acesso-usuario.guard';
import { P404Component } from './componentes/404/404.component';
import { TermosDeUsoComponent } from './componentes/termos-de-uso/termos-de-uso.component';
import { PoliticaPrivacidadeComponent } from './componentes/politica-privacidade/politica-privacidade.component';


@NgModule({
  imports: [
    BrowserModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    PopoverModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    ChartsModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutPadraoComponent,
    CadastroUsuarioLoginComponent,
    LayoutLoginComponent,
    P404Component,
    TermosDeUsoComponent,
    PoliticaPrivacidadeComponent
  ],
  providers: [
    AcessoUsuarioGuard
  ],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule {}
