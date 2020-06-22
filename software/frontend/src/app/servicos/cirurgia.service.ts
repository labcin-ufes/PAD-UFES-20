import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { URL_API } from './../utils/url-api';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import PacienteCirurgia from '../modelo/PacienteCirurgia';

@Injectable({
  providedIn: 'root'
})
export class CirurgiaService {

  private pacienteCirurgia: PacienteCirurgia;

  constructor(private http: HttpClient) { }

  /**
   * @author Gabriel G
   * Método para cadastrar um paciente da cirurgia no sistema
   * @param pacienteCirurgia Paciente da cirurgia a ser cadastrado no sistema
   */
  public cadastrarPacienteCirurgia (pacienteCirurgia: PacienteCirurgia): Observable<any> {
    return this.http.post(`${URL_API}/api/pacienteCirurgia`, pacienteCirurgia);
  }

  /**
   * @author André Pacheco
   * Método para buscar nomes de cirurgiao contendo o nome passado
   * @param nome String que tem que casar com a busca
   */
  public obtemCirurgiaoPorNomeContendo (nome: string): Observable<any> {
    return this.http.get(`${URL_API}/api/cirurgiao/search/findByNomeContaining?nome=${nome}`)
    .pipe(
      map( resp => resp['_embedded'].cirurgiao.map(cid => cid.nome))
    );
  }

}
