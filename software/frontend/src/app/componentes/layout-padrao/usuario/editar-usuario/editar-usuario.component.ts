import { NgForm } from '@angular/forms';
import { UsuarioService } from './../../../../servicos/usuario.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Usuario from '../../../../modelo/Usuario';

@Component({
    selector: 'app-editar-usuario',
    styleUrls: ['./editar-usuario.component.css'],
    templateUrl: './editar-usuario.component.html',
    providers: [ UsuarioService ]
  })
export class EditarUsuarioComponent implements OnInit {

    public usuario: any;
    public flagFalha: boolean;
    public flagSenhaIncorreta: boolean;
    public respEdicao: string;

    // Esse decorador permite recuperar os dados do formulario no template html
    @ViewChild('dadosForm')
    public dadosForm: NgForm;

    // Dados que devem vim do banco para ser apresentados dentro do form
    public nomeCompleto: string;
    public email: string;
    public nomeUsuario: string;
    public papel: string;

    constructor (
        private route: ActivatedRoute,
        private usuarioService: UsuarioService
    ) {
        this.flagFalha = false;
        this.respEdicao = '';
        this.flagSenhaIncorreta = true;
    }

    ngOnInit () {
        // AQUI TEM QUE SER USUARIO LOGADO. PEGANDO POR NOME SO PARA TESTE
        this.usuarioService.obtemUsuarioLogado()
        .subscribe(
            resp => {
                this.usuario = resp.principal;
                this.nomeCompleto = resp.principal.nomeCompleto;
                this.email = resp.principal.email;
                this.nomeUsuario = resp.principal.nomeUsuario;
                this.papel = resp.principal.papel;

                // Agora tem que buscar o usuario retornado com o get pois as
                // URL de atualização do mesmo nao vem na resposta do usuario logado

                this.usuarioService.obtemPorNomeUsuario(this.nomeUsuario)
                .subscribe(
                    resp2 => {
                        this.usuario = resp2;
                    },
                    erro => {
                        console.log(erro);
                        this.respEdicao = 'problema-requisicao';
                    }
                );
                console.log(this.usuario);

                /*
                this.usuario = 'teste';
                this.nomeCompleto = 'ANDRE PACHECO';
                this.email = 'pacheco.comp@gmail.com';
                this.nomeUsuario = 'andre';

                console.log(this.usuario);
                console.log(this.nomeCompleto);
                console.log(this.email);
                console.log(this.nomeUsuario);
                */
            },
            erro => this.respEdicao = 'problema-requisicao'
        );
    }

    public checaSenhaUsuario (senha: string): void {
        this.usuarioService.compararSenhas(this.usuario.nomeUsuario, senha)
        .subscribe(
            resp => {
                console.log(resp);
                if (resp.estado === 'senha-correta') {
                    this.flagSenhaIncorreta = false;
                } else {
                    this.flagSenhaIncorreta = true;
                }
            }
        );
    }

    public recebeDadosForm (): void {
        const usuarioAtt = new Usuario (
            this.dadosForm.value.nomeCompleto,
            this.dadosForm.value.nomeUsuario,
            this.dadosForm.value.novaSenha,
            this.dadosForm.value.email,
            true,
            this.papel
        );

        const url = this.usuario._links.usuario.href;

        // Mandando a requisição com a alteração
        this.usuarioService.atualizaUsuario(usuarioAtt, url)
        .subscribe(
            resp => {
                this.respEdicao = 'usuario-atualizado';
                this.dadosForm.controls['senhaAtual'].reset();
                this.dadosForm.controls['novaSenha'].reset();
                this.usuario = resp;
            },
            erro => {
                if (erro.status === 409) {
                    this.respEdicao = 'usuario-existente';
                    this.dadosForm.controls['senhaAtual'].reset();
                    this.dadosForm.controls['novaSenha'].reset();
                } else {
                    this.flagFalha = true;
                }
            }
        );
    }
}
