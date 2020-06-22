import { Injectable } from '@angular/core';
import { URL_API } from './../utils/url-api';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, filter, catchError, mergeMap, retry } from 'rxjs/operators';
import Usuario from '../modelo/Usuario';
import { htmlAstToRender3Ast } from '@angular/compiler/src/render3/r3_template_transform';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuarioLogado: Usuario;

  constructor(private http: HttpClient) { }

  /**
   * Método para cadastrar um usuário no sistema utilizando a api-aberta,
   * ou seja, nao precisa estar logado para cadastrar
   * @author André Pacheco
   * @param usuario Usuario a ser cadastrado no sistema
   */
  public cadastrarUsuarioLogin (usuario: Usuario): Observable<any> {
    return this.http.post(`${URL_API}/api-aberta/cadastrar-usuario`, usuario);
  }

  /**
   * Método para cadastrar um usuário no sistema de dentro do dashboard
   * @author André Pacheco
   * @param usuario Usuario a ser cadastrado no sistema
   */
  public cadastrarUsuarioDashboard (usuario: Usuario): Observable<any> {
    return this.http.post(`${URL_API}/api/usuario`, usuario);
  }

  /**
   * Apenas um método para retornar o usuário logado na aplicação
   * @author André Pacheco
   */
  public obtemUsuarioLogado (): Observable<any> {
    return this.http.get(`${URL_API}/api/usuario/usuario-logado`);
  }

  /**
   * Método para buscar um quantidade de usuários especificada no banco de dados
   * @author André Pacheco
   * @param pag Página a ser buscada
   * @param qntd Quantidade de usuários por página
   */
  public obtemUsuariosPaginados (pag: number, qntd: number): Observable<any> {
    return this.http.get(`${URL_API}/api/usuario?page=${pag}&size=${qntd}&sort=nomeCompleto`);
  }

  /**
   * Método para retornar um usuário de acordo com o nomeUsuario do mesmo
   * @author André Pacheco
   * @param nomeUsuario Página a ser buscada
   * @returns Um array de contendo os usuarios
   */
  public obtemPorNomeUsuario (nomeUsuario: string): Observable<any> {
    return this.http.get(`${URL_API}/api/usuario/search/findByNomeUsuario?nomeUsuario=${nomeUsuario}`);
  }

  /**
   * Método para atualizar se o usuário está apto a acessar ao sistema
   * @author André Pacheco
   * @param apto Recebe true ou false para indicar o acesso
   * @param url Um string com a url do usuário a ser alterado
   */
  public atualizaAptoUsuario (apto: boolean, url: string): Observable<any> {
    const dado = {
      'apto': apto
    };
    return this.http.patch(url, dado);
  }

  /**
   * Método para atualizar o papel do usuário
   * @author André Pacheco
   * @param papel String com o novo papel do usuário
   * @param url Um string com a url do usuário a ser alterado
   */
  public atualizaPapelUsuario (papel: string, url: string): Observable<any> {
    const dado = {
      'papel': papel
    };
    return this.http.patch(url, dado);
  }

  /**
   * Método para apagar um usuário do banco de dados
   * @author André Pacheco
   * @param url Um string com a url do usuário a ser apagado do banco
   */
  public apagarUsuario (url: string): Observable<any> {
    return this.http.delete(url);
  }

  /**
   * Método para comparar se a senha do usuário está correta no momento da alteração da mesma
   * @author André Pacheco
   * @param nomeUsuario String com o nome do usuário
   * @param senha String com a senha do usuário informado
   */
  public compararSenhas (nomeUsuario: string, senha: string): Observable<any> {
    const dados = {
      'nomeUsuario': nomeUsuario,
      'senha': senha
    };
    return this.http.post(`${URL_API}/api/usuario/compara-senhas`, dados);
  }

  /**
   * Método para atualizar um usuário
   * @author André Pacheco
   * @param usuario Usuario a ser atualizado
   * @param url String com a url do usuario a ser atualizado
   */
  public atualizaUsuario (usuario: Usuario, url: string): Observable<any> {
    return this.http.put(url, usuario);
  }

  /**
   * Método para realizar o logou do usuario
   */
  public logout (): Observable<any> {
    return this.http.get(`${URL_API}/logout`);
  }
}
