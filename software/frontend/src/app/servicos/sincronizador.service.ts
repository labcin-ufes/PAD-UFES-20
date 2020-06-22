import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_API } from '../utils/url-api';
import { TOKEN_API } from '../utils/token-api';

@Injectable({
  providedIn: 'root'
})
export class SincronizadorService {

  constructor( private http: HttpClient) { }

  /**
   * Método para sincronizar as imagens do servidor local com o remoto. Em resumo, baixa as imagens do remoto para
   * o local e o troca pelo que existe no local
   * @param urlServer String opcional com a url do servidor que deseja sincronizar.
   * Se nada for informado, considera o http://labcin1.ufes.br
   */
  public atualizarImagensServerLocal (urlServer?: string): Observable<any> {
    const form = new FormData;
    form.append('token', TOKEN_API);
    if (urlServer !== undefined) {
      form.append('urlServer', urlServer);
    }

    // Isso é feito desta maneira para monitorar o envio dos dados
    const req = new HttpRequest('POST', `${URL_API}/api-aberta/sincronizador/atualizar-imagens-local`, form, {
      reportProgress: true,
    });

    return this.http.request(req);

  }

  /**
   * Método para sincronizar o servidor local com o remoto. Em resumo, baixa o banco remoto para
   * o local e o coloca como banco do local
   * @param urlServer String opcional com a url do servidor que deseja sincronizar.
   * Se nada for informado, considera o http://labcin1.ufes.br
   */
  public atualizarBancoServerLocal (urlServer?: string): Observable<any> {
    const form = new FormData;
    form.append('token', TOKEN_API);
    if (urlServer !== undefined) {
      form.append('urlServer', urlServer);
    }

    // Isso é feito desta maneira para monitorar o envio dos dados
    const req = new HttpRequest('POST', `${URL_API}/api-aberta/sincronizador/atualizar-banco-local`, form, {
      reportProgress: true,
    });

    return this.http.request(req);

  }

  /**
   * Método para sincronizar as imagens do servidor remoto com o local. Em resumo, o servidor local
   * envia as imagens para o remoto que por sua vez apaga ou as adicionam
   * @param urlServer String opcional com a url do servidor que deseja sincronizar.
   * Se nada for informado, considera o http://labcin1.ufes.br
   */
  public atualizarImagensServerRemoto (urlServer?: string): Observable<any> {
    const form = new FormData;
    form.append('token', TOKEN_API);
    if (urlServer !== undefined) {
      form.append('urlServer', urlServer);
    }

    // Isso é feito desta maneira para monitorar o envio dos dados
    const req = new HttpRequest('POST', `${URL_API}/api-aberta/sincronizador/atualizar-imagens-remoto`, form, {
      reportProgress: true,
    });

    return this.http.request(req);

  }

  /**
   * Método para sincronizar o servidor remoto com o local. Em resumo, o servidor local
   * envia o seu banco para o remoto que por sua vez realiza a troca para o mais atualizado.
   * @param urlServer String opcional com a url do servidor que deseja sincronizar.
   * Se nada for informado, considera o http://labcin1.ufes.br
   */
  public atualizarBancoServerRemoto (urlServer?: string): Observable<any> {
    const form = new FormData;
    form.append('token', TOKEN_API);
    if (urlServer !== undefined) {
      form.append('urlServer', urlServer);
    }

    // Isso é feito desta maneira para monitorar o envio dos dados
    const req = new HttpRequest('POST', `${URL_API}/api-aberta/sincronizador/atualizar-banco-remoto`, form, {
      reportProgress: true,
    });

    return this.http.request(req);

  }

}
