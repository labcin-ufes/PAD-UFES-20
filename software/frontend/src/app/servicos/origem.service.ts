import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from './../utils/url-api';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrigemService {

  constructor(private http: HttpClient) { }

  /**
   * @author Gabriel G.
   * Método para buscar nomes de origem contendo o nome passado
   * @param nome String que tem que casar com a busca
   */
  public obtemOrigemPorNomeContendo (nome: string): Observable<any> {
    return this.http.get(`${URL_API}/api/origem/search/findByNomeContaining?nome=${nome}`)
    .pipe(
      map( resp => resp['_embedded'].origem.map(ori => ori.nome))
    );
  }
}
