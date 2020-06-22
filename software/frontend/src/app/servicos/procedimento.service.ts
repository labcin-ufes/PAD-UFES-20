import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_API } from '../utils/url-api';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProcedimentoService {

  constructor( private http: HttpClient) { }

  /**
   * Método para buscar nomes de cidade contendo o nome passado
   * @author André Pacheco
   * @param nome String que tem que casar com a busca
   */
  public obtemProcedimentoPorNomeContendo (nome: string): Observable<any> {
    return this.http.get(`${URL_API}/api/procedimento/search/findByNomeContaining?nome=${nome}`)
    .pipe(
      map( resp => resp['_embedded'].procedimento.map(proc => proc.nome))
    );
  }

}
