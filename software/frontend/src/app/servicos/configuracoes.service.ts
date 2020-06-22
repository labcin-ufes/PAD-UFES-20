import { URL_API } from './../utils/url-api';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracoesService {


  constructor(private http: HttpClient) { }

  /**
   * Método que busca o status de uma determinada configuracao
   * @author Pedro Biasutti
   * @param parametro
   */
  public pegaConfiguracao (parametro: string): Observable<any> {

    return this.http.get(`${URL_API}/api/configuracoes/search/findByParametro?parametro=${parametro}`);

  }

  /**
   * Método para alterar o status de um parametro dado sua URL e os novos dados
   * @author Pedro Biasutti
   * @param url link contendo o caminho para o dado parametro
   * @param dados form contendo parametro com seu respectivo valor
   */
  public salvaConfiguracao (url: string, dados: object): Observable<any> {

    return this.http.patch(url, dados);

  }

}
