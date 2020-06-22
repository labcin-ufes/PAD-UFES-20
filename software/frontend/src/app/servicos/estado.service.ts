import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from './../utils/url-api';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  constructor(private http: HttpClient) { }

  /**
   * @author Gabriel G.
   * Método para buscar nomes de estado contendo o nome passado
   * @param nome String que tem que casar com a busca
   */
  public obtemEstadoPorNomeContendo (nome: string): Observable<any> {
    return this.http.get(`${URL_API}/api/estado/search/findByNomeContaining?nome=${nome}`)
    .pipe(
      map( resp => resp['_embedded'].estado.map(est => est.nome))
    );
  }
}
