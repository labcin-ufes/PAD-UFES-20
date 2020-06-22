import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from './../utils/url-api';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticoService {

  constructor(private http: HttpClient) { }

  /**
   * @author André Pacheco
   * Método para buscar nomes de diagnostico contendo o nome passado
   * @param nome String que tem que casar com a busca
   */
  public obtemDiagPorNomeContendo (nome: string, subtipo = false): Observable<any> {

    if (subtipo) {
      return this.http.get(`${URL_API}/api/diagnostico/search/findByNomeContainingAndSubtipoTrue?nome=${nome}`)
      .pipe(
        map( resp => resp['_embedded'].diagnostico.map(diag => diag.nome))
      );
    } else {
      return this.http.get(`${URL_API}/api/diagnostico/search/findByNomeContainingAndSubtipoFalse?nome=${nome}`)
      .pipe(
        map( resp => resp['_embedded'].diagnostico.map(diag => diag.nome))
      );
    }
  }
}
