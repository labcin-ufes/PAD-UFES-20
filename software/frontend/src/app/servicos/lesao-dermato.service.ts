import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_API } from './../utils/url-api';
import LesaoDermato from '../modelo/LesaoDermato';


@Injectable({
  providedIn: 'root'
})
export class LesaoDermatoService {

  constructor(private http: HttpClient) { }

  /**
   * Obtém lesões dermato
   * @param {...any[]} args
   * @author Guilherme Esgario
   */
  public obtemLesao(...args: any[]): Observable<any> {
    if (args.length === 0) {
      return this.http.get(`${URL_API}/api/lesaoDermato`);
    } else if (args.length === 1) {
      return this.http.get(`${URL_API}/api/lesaoDermato/${args[0]}`);
    } else {
      return this.http.get(`${URL_API}/api/lesaoDermato/${args[0]}/${args[1]}`);
    }
  }

  /**
   * Metodo para obter todas as lesões da dermato
   * @param tam quantidade a ser retornada por pagina
   * @param pag numero de paginas
   * @author André Pacheco
   */
  public obtemTodos (tam=5, pag=0): Observable <any> {
    return this.http.get(`${URL_API}/api/lesaoDermato?&page=${pag}&size=${tam}`);
  }

  /**
   * Retorna uma lesão pegando pela URL
   * @param url String com a URL da lesao
   * @author André Pacheco
   */
  public obtemLesaoViaUrl(url: string): Observable <any> {
    return this.http.get(url);
  }

  /**
   * @author Felipe Branquinho
   * Método para obter lesoes de um paciente já cadastrado
   * @param pacienteId id do paciente desejado
   * @param page numero da pagina buscada
   * @param size numero maximo de objetos retornados
   */
  public obtemLesaoPaginada (pacienteId: string, page: number, size: number): Observable <any> {
    return this.http.get(`${URL_API}/api/lesaoDermato/search/findByPaciente?paciente=paciente/${pacienteId}&page=${page}&size=${size}`);
  }

  /**
   * Método para salvar uma lesão
   * @param lesao lesao a ser salva
   * @author André Pacheco
   */
  public salvaLesaoDermato (lesao: LesaoDermato): Observable<any> {
    return this.http.post (`${URL_API}/api/lesaoDermato`, lesao);
  }

  /**
   * Atualiza os dados da lesão fazendo um PUT. É necessário todas as informações
   * para isso ocorrer.
   * @param lesao LesãoDermato preenchida
   * @author Andre Pacheco
   */
  public atualizarLesao (lesao: LesaoDermato, url: string): Observable<any> {
    return this.http.put (url, lesao);
  }

  /**
   * Método para apagar uma lesão
   * @param url String com a url da lesao a ser apagada
   * @author André Pacheco
   */
  public apagarLesao (url: string): Observable<any> {
    return this.http.delete(url);
  }

  /**
   * Método para linkar uma lesao a um paciente
   * @param lesao lesao a ser salva
   * @author André Pacheco
   */
  public linkarPacienteLesao (urlLes: string, pacId: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'text/uri-list'
      })
    };
    return this.http.put (urlLes + '/paciente', `${URL_API}/api/pacienteDermato/${pacId}`, httpOptions);
  }

  /**
   * Método para filtrar os dados das lesões de dermato.
   * Somente a página e o tamanho da mesma são obrigatórios.
   * Os demais campos podem ou não serem preenchidos.
   * @author Guilherme Esgario
   * @param pagina Pagina a ser retornada
   * @param tam Numero de elementos da pagina retornada
   * @param diagnóstico Filtragem por diagnostico
   * @param diagnósticoSec Filtragem por diagnostico secundário
   * @param regiao Filtragem por região do corpo
   * @returns {Observable<any>}
   */
  public filtragem (
    pagina: number,
    tam: number,
    diagnostico?: string,
    diagnosticoSec?: string,
    regiao?: string
    ): Observable<any> {

      const form = new FormData();
      form.append('page', pagina.toString());
      form.append('size', tam.toString());

      if (diagnostico !== undefined) {
        form.append('diagnostico', diagnostico);
      }

      if (regiao !== undefined) {
        form.append('regiao', regiao);
      }

      return this.http.post(`${URL_API}/api/filtro/lesaoDermato`, form);
    }

}
