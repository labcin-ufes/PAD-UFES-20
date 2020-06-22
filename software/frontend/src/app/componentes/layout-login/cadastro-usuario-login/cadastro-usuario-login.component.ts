import { Router } from '@angular/router';
import { UsuarioService } from './../../../servicos/usuario.service';
import { NgForm } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import Usuario from '../../../modelo/Usuario';
import { ModalDirective } from 'ngx-bootstrap';

// Este seletor necessariamente deve ser 'app-dashboard'
// sua mudança possui impacto direto no layout da página.
@Component({
  selector: 'app-dashboard',
  templateUrl: './cadastro-usuario-login.component.html',
  styleUrls: ['./cadastro-usuario-login.component.css'],
  providers: [ UsuarioService ]
})
export class CadastroUsuarioLoginComponent {

  // Esse decorador permite recuperar os dados do formulario no template html
  @ViewChild('dadosCadastroForm')
  public dadosCadastroForm: NgForm;

  public flagSenhaIncompativel: boolean;
  public flagRespostaCadastro: string;

  public usuario: Usuario;

  @ViewChild('modalCadastrando')
  public modalCadastrando: ModalDirective;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router) {
    this.flagSenhaIncompativel = false;
    this.flagRespostaCadastro = 'false';
  }

  public checaSenhasIguais (): void {
    // Verificando se as duas senhas digitadas são iguais
    if (this.dadosCadastroForm.value.senha !== this.dadosCadastroForm.value.senhaRepetida) {
      this.flagSenhaIncompativel = true;
    } else {
      this.flagSenhaIncompativel = false;
    }
  }

  public recebeCadastroForm (): void {
    console.log(this.dadosCadastroForm);

    this.modalCadastrando.config.backdrop = 'static';
    this.modalCadastrando.config.keyboard = false;
    this.modalCadastrando.show();

    this.usuario = new Usuario(
      this.dadosCadastroForm.value.nomeCompleto,
      this.dadosCadastroForm.value.nomeUsuario,
      this.dadosCadastroForm.value.senha,
      this.dadosCadastroForm.value.email
    );

      this.usuarioService.cadastrarUsuarioLogin(this.usuario).subscribe(
        resp => {
          this.flagRespostaCadastro = resp.estado;
          if (resp.estado === 'cadastrado') {
            this.dadosCadastroForm.reset();
          } else if (resp.estado === 'nao-permitido') {
            this.dadosCadastroForm.controls['nomeUsuario'].reset();
            this.dadosCadastroForm.controls['email'].reset();
          }
          this.modalCadastrando.hide();
        });

  }

}
