import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from './../utils/url-api';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class GerarDatasetService {
  
    constructor(private http: HttpClient) { }
  
    /**
     * Método que retorna arquivo zip com dataset e imagens
     * @author Felipe Branquinho
     */
    public gerarDataset (pacTipo: string, dados: string): Observable<any> {
        /* console.log(`${URL_API}/api/geraDataset?pacTipo=`+pacTipo+`&dados=`+dados); */
        const req = new HttpRequest ('GET', `${URL_API}/api/zip?pacTipo=`+pacTipo+`&dados=`+dados, {
          responseType: 'blob',
          reportProgress: true,
        });

        return this.http.request(req);
    }

    public deletaDataset (pacTipo: string): any {
      return this.http.get(`${URL_API}/api/deletaDataset?pacTipo=`+pacTipo);
    }
}