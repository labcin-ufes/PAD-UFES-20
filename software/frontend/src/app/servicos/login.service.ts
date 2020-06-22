import { URL_API } from './../utils/url-api';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, filter, catchError, mergeMap, retry } from 'rxjs/operators';

// const httpForm = {
//   headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' })
// };

@Injectable({
  providedIn: 'root'
})
export class LoginService {


  constructor(private http: HttpClient) { }

  /**
   * @author André Pacheco
   *
   * Método do serviço que faz a chamada da API para efetuar o login do usuário no sistema
   *
   * @param nomeUsuario Nome do usuário a ser informado para autenticação
   * @param senha Senha do usuário a ser informado para autenticação
   */
  public efetuaLogin (nomeUsuario: string, senha: string): Observable<any> {

    const credenciais = new FormData();
    credenciais.append('username', nomeUsuario);
    credenciais.append('password', senha);

    return this.http.post(`${URL_API}/login`, credenciais);

  }

  /**
   * Método para deslogar do usuário do sistema
   */
  public sair (): Observable<any> {
    return this.http.get(`${URL_API}/logout`);
  }

  public recuperarSenha (email: string): Observable<any> {
    const body = {
      'email': email
    };
    return this.http.post(`${URL_API}/api-aberta/recuperar-senha`, body);
  }

}
