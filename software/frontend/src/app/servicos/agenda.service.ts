import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_API } from '../utils/url-api';

class Agenda {
    local: string;
    data: string;
}

const agenda: Agenda[] = [
   { local: 'local 1', data: '01/01/2019' },
   { local: 'local 2', data: '01/02/2019' },
   { local: 'local 3', data: '01/03/2019' },
   { local: 'local 4', data: '01/04/2019' },
   { local: 'local 5', data: '01/05/2019' },
   { local: 'local 6', data: '01/06/2019' },
   { local: 'local 7', data: '01/07/2019' },
   { local: 'local 8', data: '01/08/2019' },
   { local: 'local 9', data: '01/09/2019' },
   { local: 'local 10', data: '01/10/2019' },
   { local: 'local 11', data: '01/11/2019' },
   { local: 'local 12', data: '01/12/2019' }
];

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  constructor( private http: HttpClient) { }

  /**
   * Método para retornar agenda
   */
  public obtemAgenda(): Observable<any> {
    return this.http.get(`${URL_API}/api/agenda/`);
  }

}
