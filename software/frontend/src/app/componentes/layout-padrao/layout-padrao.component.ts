import { UsuarioService } from './../../servicos/usuario.service';
import { LoginService } from './../../servicos/login.service';
import { ConfiguracoesService } from './../../servicos/configuracoes.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { navItemsSuper, navItemsAdmin, navItemsUser } from './../../_nav';
import { Router } from '@angular/router';
import Usuario from '../../modelo/Usuario';
import { Observable } from 'rxjs';
import { DEFAULT_ROLE } from '../../../environments/environment';


// Este seletor necessariamente deve ser 'app-dashboard'
// sua mudança possui impacto direto no layout da página.
@Component({
  selector: 'app-dashboard',
  templateUrl: './layout-padrao.component.html',
  providers: [
    LoginService,
    UsuarioService
  ]
})
export class LayoutPadraoComponent implements OnDestroy, OnInit {
  public navItems = [];
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  public flagViagem = false;

  constructor(
    private loginService: LoginService,
    private usuarioService: UsuarioService,
    private configuracoesService: ConfiguracoesService,
    private router: Router) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: [ 'class' ]
    });
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }

  ngOnInit(): void {
    this.obtemUsuarioLogado();
  }

  public sair (): void {
    this.loginService.sair().subscribe(
      () => console.log('saiu'),
      (erro) => console.log('Erro: ', erro)
    );

    this.router.navigate(['/login']);
  }

  public obtemUsuarioLogado (): void {
    this.usuarioService.obtemUsuarioLogado().subscribe(
      (resp) => {

        if (resp !== null) {
          this.usuarioService.usuarioLogado = new Usuario (
            resp.principal.nomeCompleto,
            resp.principal.nomeUsuario,
            resp.principal.senha,
            resp.principal.email,
            resp.principal.apto,
            resp.principal.papel,
          );
        } else {
          this.usuarioService.usuarioLogado = new Usuario('', '', '', '', false, DEFAULT_ROLE);
          console.log (resp);
        }
        this.trocaItensDeNavegacao();
      }
    );
  }

  public trocaItensDeNavegacao (): void {
    if (this.usuarioService.usuarioLogado.papel === 'SUPER') {
      this.navItems = navItemsSuper;
    } else if (this.usuarioService.usuarioLogado.papel === 'ADMIN') {
      // Se for ADMIN, caso esteja occorrendo uma viagem do PAD, bloqueia tudo
      this.verficaViagemPad();
      this.navItems = navItemsAdmin;
    } else {
      // Se for USER, caso esteja occorrendo uma viagem do PAD, bloqueia tudo
      this.verficaViagemPad();
      this.navItems = navItemsUser;
    }
  }

  public verficaViagemPad (): void {
    this.configuracoesService.pegaConfiguracao('EM VIAGEM').
    subscribe(
      resp => {
        console.log('resp.status', resp.status);
        this.flagViagem = resp.status;
      },
      erro => {
        console.log('erro status', erro);
      }
    );
  }

}
