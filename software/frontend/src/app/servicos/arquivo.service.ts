import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_API } from '../utils/url-api';
import { TOKEN_API } from '../utils/token-api';

@Injectable({
  providedIn: 'root'
})
export class ArquivoService {

  constructor( private http: HttpClient) { }

  public uploadArquivo (arq: any, urlServer: string, path?: string): Observable<any> {
    const form = new FormData;

    form.append('arquivo', arq);
    form.append('token', TOKEN_API);
    if (path !== undefined) {
      form.append('path', path);
    }

    // Isso é feito desta maneira para monitorar o envio dos dados
    const req = new HttpRequest('POST', urlServer + '/api-aberta/atualizar-sistema', form, {
      reportProgress: true,
    });

    return this.http.request(req);

  }

}
