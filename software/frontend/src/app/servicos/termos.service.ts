import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from './../utils/url-api';

@Injectable({
  providedIn: 'root'
})
export class TermosService {

  constructor(private http: HttpClient) { }

  /**
   * @author Guilherme Esgario
   * Método para buscar determinado termo
   * @param tipo String que tem que casar com a busca
   * ex: 'termosHTML' e 'politicasHTML'
   */
  public obtemTermos(tipo: string): Observable<any> {
    return this.http.get(`${URL_API}/api-aberta/termos/${tipo}`);
  }
}
