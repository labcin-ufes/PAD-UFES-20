import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../../../../servicos/usuario.service';
import Usuario from '../../../../modelo/Usuario';

@Component({
  selector: 'app-novo-usuario',
  templateUrl: './novo-usuario.component.html',
  styleUrls: ['./novo-usuario.component.css'],
  providers: [ UsuarioService ]
})
export class NovoUsuarioComponent {

  // Esse decorador permite recuperar os dados do formulario no template html
  @ViewChild('dadosCadastroForm')
  public dadosCadastroForm: NgForm;

  public flagSenhaIncompativel: boolean;
  public flagRespostaCadastro: string;

  public usuario: Usuario;

  constructor(private usuarioService: UsuarioService) {
    this.flagSenhaIncompativel = false;
    this.flagRespostaCadastro = 'false';
  }

  public checaSenhasIguais (): void {
    // Verificando se as duas senhas digitadas são iguais
    if (this.dadosCadastroForm.value.senha !== this.dadosCadastroForm.value.repsenha) {
      this.flagSenhaIncompativel = true;
    } else {
      this.flagSenhaIncompativel = false;
    }
  }

  public recebeCadastroForm (): void {
    console.log(this.dadosCadastroForm);
    this.usuario = new Usuario (
      this.dadosCadastroForm.value.nomeCompleto,
      this.dadosCadastroForm.value.nomeUsuario,
      this.dadosCadastroForm.value.senha,
      this.dadosCadastroForm.value.email,
      true,
      this.dadosCadastroForm.value.papel
    );

    this.usuarioService.cadastrarUsuarioDashboard(this.usuario)
    .subscribe(
      resp => {
        this.flagRespostaCadastro = 'usuario-cadastrado';
        this.dadosCadastroForm.reset();
      },
      erro => {
        // Nesse caso, existe uma replicação de nome de usuário ou email no banco.
        if (erro.status === 409) {
          this.flagRespostaCadastro = 'usuario-existente';
          this.dadosCadastroForm.controls['nomeUsuario'].reset();
          this.dadosCadastroForm.controls['email'].reset();
        } else {
          // Aqui já é outro problema na requisição
          this.flagRespostaCadastro = 'problema-requisicao';
        }
      }
    );
  }

}
