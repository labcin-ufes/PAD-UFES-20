import { LoginService } from './../../../servicos/login.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {Router} from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';

// Este seletor necessariamente deve ser 'app-dashboard'
// sua mudança possui impacto direto no layout da página.
@Component({
  selector: 'app-dashboard',
  templateUrl: './login.component.html',
  providers: [ LoginService ]
})
export class LoginComponent implements OnInit {

  // Esse decorador permite recuperar os dados do formulario no template html
  @ViewChild('dadosLoginForm')
  public dadosLoginForm: NgForm;

  @ViewChild('dadosRecSenhaForm')
  public dadosRecSenhaForm: NgForm;

  public flagFalhaLogin: boolean;
  public resposta: any;

  public flagRecSenha: string;

  public enviando: boolean;

  @ViewChild('modalRecSenha')
  public modalRecSenha: ModalDirective;

  // Quando passamos o método no construtor dessa forma, ele já faz a atribuição
  // para o atributo da classe
  constructor (
    private loginService: LoginService,
    private router: Router) {

    this.flagFalhaLogin = false;
    this.flagRecSenha = 'false';
    this.enviando = false;
  }

  ngOnInit () {

  }

  /**
   * @author André Pacheco
   *
   * Funcão que recebe os dados do formulário de login e decide o direcionamento da página caso o usuários sejá autenticado
   *
   */
  public recebeLoginForm (): void {

    this.loginService.efetuaLogin(this.dadosLoginForm.value.nomeUsuario, this.dadosLoginForm.value.senha).
    subscribe( resp => {
      console.log (resp);

      if (resp.estado === 'usuario-autenticado') {
        this.flagFalhaLogin = false;
        this.router.navigate(['/dashboard']);
      } else {
        this.flagFalhaLogin = true;
        this.dadosLoginForm.controls['senha'].reset();
      }
    });

  }

  public recebeRecSenhaForm (): void {
    console.log (this.dadosRecSenhaForm.value.email);
    this.enviando = true;

    this.loginService.recuperarSenha(this.dadosRecSenhaForm.value.email)
    .subscribe ( resp =>  {
      console.log(resp);
      this.flagRecSenha = resp.estado;
      this.enviando = false;
      this.modalRecSenha.hide();
    });
  }

}
