import { UsuarioService } from './../../../../servicos/usuario.service';
import { Component, OnInit } from '@angular/core';
import Usuario from '../../../../modelo/Usuario';

@Component({
  selector: 'app-visualizar-usuario',
  styleUrls: ['./visualizar-usuario.component.css'],
  templateUrl: './visualizar-usuario.component.html',
  providers: [ UsuarioService ]
})
export class VisualizarUsuarioComponent implements OnInit {

  public usuarios: [];
  public flagFalha: boolean;
  public respAlteracao: string;

  // atributos para paginancao
  public itensPorPag: number; // Define quantos elementos serao retornados por paginas
  public totalItens: number; // Total de itens a ser exibidos na tabela
  public paginaAtual: number; // página atualmente selecionada
  public maxPagLinks: number; // maximo de links que a pagina pode exibir (os boxes com os numeros)
  public totalPaginas: number; // o numero de paginas retornadas pela requisicao
  constructor(private usuarioService: UsuarioService) {

     // atributos para paginancao
    this.flagFalha = false;
    this.itensPorPag = 10;
    this.maxPagLinks = 10;
    this.paginaAtual = 1;

    this.respAlteracao = '';

  }

  ngOnInit() {
    this.obtemUsuarios (this.paginaAtual);
  }

  /**
   * Método para identificar a mudança da página ao clicar no botão
   * @param event Captura o evento realizado. Com ele é possível pegar
   * valores como a página selecionada
   */
  public mudaPagina(event: any): void {
    // Altera a página quando clicado no link
    this.paginaAtual = event.page;
    this.obtemUsuarios (this.paginaAtual);
  }

  /**
   * Método interno para obter os dados dos usuários
   * @param pag Pagina a ser buscada no banco
   */
  public obtemUsuarios (pag: number): void {
    this.usuarioService.obtemUsuariosPaginados(pag - 1, this.itensPorPag)
    .subscribe(
      resp => {
        this.usuarios = resp._embedded.usuario;
        this.totalItens = resp.page.totalElements;
        this.totalPaginas = resp.page.totalPages;
      },
      erro => {
        this.flagFalha = true;
      }
    );
  }

  /**
  * @author André Pacheco
  * Método para pegar o click do botao excluir usuário e executar os procedimentos
  * para atingir o objetivo da exclusão
  */
  public excluirUsuario (usuario: any): void {
    console.log(usuario._links.usuario.href);
    this.respAlteracao = 'usuario-apagado';

    this.usuarioService.apagarUsuario(usuario._links.usuario.href)
    .subscribe (
      resp => {
        this.respAlteracao = 'usuario-apagado';
        this.obtemUsuarios (this.paginaAtual);
      },
      erro => {
        this.respAlteracao = 'apagar-falha';
      }
    );

  }

  /**
  * @author André Pacheco
  * Método para alterar se o usuário pode acessar ou não o sistema.
  * para atingir o objetivo da exclusão
  * @param usuario Um objeto com os dados do usuario a ser alterado
  */
  public trocarAcessoUsuario (usuario: any): void {
      // Alterando o valor do campo
      usuario.apto = !usuario.apto;

      this.usuarioService.atualizaAptoUsuario(
        usuario.apto,
        usuario._links.usuario.href)
      .subscribe(
        resp => {
          this.respAlteracao = 'apto-salvo';
        },
        erro => {
          this.respAlteracao = 'apto-falha';
          console.log(erro);
        }
      );
  }

  /**
  * @author André Pacheco
  * Método para alterar o nível de acesso do usuario.
  * @param nomeUsuario String que representa o nome do usuario a ser alterado
  */
  public trocarNivelAcessoUsuario(usuario: any) {
    // Alterando o campo
    if (usuario.papel === 'USER') {
      usuario.papel = 'ADMIN';
    } else {
      usuario.papel = 'USER';
    }

    this.usuarioService.atualizaPapelUsuario(
      usuario.papel,
      usuario._links.usuario.href)
    .subscribe(
      resp => {
        this.respAlteracao = 'papel-salvo';
      },
      erro => {
        this.respAlteracao = 'papel-falha';
        console.log(erro);
      }
    );
  }

}
