import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { URL_API } from './../utils/url-api';


@Injectable({
  providedIn: 'root'
})
export class SegmentarImagemService {

  constructor(private http: HttpClient) { }

  /**
   * Método para filtrar os dados das lesões tanto da Cirurgia quanto da Dermato.
   * Somente a página e o tamanho da mesma são obrigatórios.
   * Os demais campos podem ou não serem preenchidos.
   * @author Pedro Biasutti
   * @param pagina Pagina a ser retornada
   * @param tam Numero de elementos da pagina retornada
   * @param segmentado Filtragem por Segmentação
   * @param cartaoSus  Filtragem por SUS
   * @param tipoPac Definindo qual metodo chamar, 'cirurgia' ou 'dermato'
   * @param id Id da lesao
   * @returns {Observable<any>}
   */
  public filtragem (
    pagina: number,
    tam: number,
    segmentado?: boolean,
    cartaoSus?: string,
    tipoPac?: string,
    id?: number,
    ): Observable<any> {

      const form = new FormData();
      form.append('page', pagina.toString());
      form.append('size', tam.toString());

      if (segmentado !== undefined) {
        form.append('segmentado', segmentado.toString());
      }

      if (cartaoSus !== undefined) {
        form.append('cartaoSus', cartaoSus);
      }

      if (id === undefined) {
        id = -1;
        form.append('id', id.toString());
      } else if ( id !== undefined) {
        form.append('id', id.toString());
      }

      return this.http.post(`${URL_API}/api/filtro/segmentarImagem/${tipoPac}`, form);
    }

}
