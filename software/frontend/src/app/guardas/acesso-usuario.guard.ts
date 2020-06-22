import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UsuarioService } from '../servicos/usuario.service';
import { of, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DEFAULT_ROLE } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AcessoUsuarioGuard implements CanActivate {

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
    ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      // Retorna verdadeiro se a 'Role' do usuário for ADMIN e false para USER
      return this.usuarioService.obtemUsuarioLogado()
          .pipe(
            map(resp => {
              if (resp !== null) {
                // Libera todas as rotas para o Super usuário
                if (resp.principal.papel === 'SUPER') {
                  return true;
                // Bloqueia rotas que contenham alguns termos específicos para os admin's
                } else if (resp.principal.papel === 'ADMIN') {
                  if (state.url.includes('extra') ||
                      state.url.includes('auditoria') ||
                      state.url.includes('dermato')) {
                      this.router.navigate(['/dashboard']);
                      return false;
                  } else {
                    return true;
                  }
                // Todas as rotas com guarda são bloqueadas para usuários comuns
                } else if (resp.principal.papel === 'USER') {
                  this.router.navigate(['/dashboard']);
                  return false;
                }
              } else {
                // Este if serve apenas para permitir o acesso as páginas durante
                // a etapa de desenvolvimento.
                if (DEFAULT_ROLE === 'SUPER') {
                  return true;
                } else if (DEFAULT_ROLE === 'ADMIN') {
                  if (state.url.includes('extra') ||
                      state.url.includes('auditoria') ||
                      state.url.includes('dermato')) {
                      this.router.navigate(['/dashboard']);
                      return false;
                  } else {
                    return true;
                  }
                } else if (DEFAULT_ROLE === 'USER') {
                  this.router.navigate(['/dashboard']);
                  return false;
                }
              }
            }),
            catchError(erro => {
              console.log(erro);
              this.router.navigate(['/dashboard']);
              return of(false); }
            )
          );
  }
}
