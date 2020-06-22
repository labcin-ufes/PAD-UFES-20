import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from './../utils/url-api';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegiaoCorpoService {

  constructor(private http: HttpClient) { }

  /**
   * @author André Pacheco
   * Método para buscar nomes de regiões do corpo contendo o nome passado
   * @param nome String que tem que casar com a busca
   */
  public obtemRegiaoPorNomeContendo (nome: string): Observable<any> {
    return this.http.get(`${URL_API}/api/regiaoCorpo/search/findByNomeContaining?nome=${nome}`)
    .pipe(
      map( resp => resp['_embedded'].regiaoCorpo.map(diag => diag.nome))
    );
  }

  /**
   * @author André Pacheco
   * Método para buscar nomes de regiões do corpo contendo o nome passado
   * @param nome String que tem que casar com a busca
   */
  public obtemRegiaoPorNome (nome: string): Observable<any> {
    return this.http.get(`${URL_API}/api/regiaoCorpo/search/findByNome?nome=${nome}`)
  }
}
