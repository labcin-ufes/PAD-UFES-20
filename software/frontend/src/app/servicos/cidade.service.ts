import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from './../utils/url-api';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CidadeService {

  constructor(private http: HttpClient) { }

  /**
   * @author André Pacheco
   * Método para buscar nomes de cidade contendo o nome passado
   * @param nome String que tem que casar com a busca
   */
  public obtemCidadePorNomeContendo (nome: string): Observable<any> {
    return this.http.get(`${URL_API}/api/cidade/search/findByNomeContaining?nome=${nome}`)
    .pipe(
      map( resp => resp['_embedded'].cidade.map(cid => cid.nome))
    );
  }
}
