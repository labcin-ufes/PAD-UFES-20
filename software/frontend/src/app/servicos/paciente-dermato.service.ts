import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from './../utils/url-api';
import PacienteDermato from '../modelo/PacienteDermato';

@Injectable({
  providedIn: 'root'
})
export class PacienteDermatoService {
  private pacienteDermato: PacienteDermato;

  constructor(private http: HttpClient) { }

  /**
   * Método para cadastrar um paciente da dermato no sistema
   * @param pacienteDermato Paciente da dermato a ser cadastrado no sistema
   * @author Beatriz Ogioni
   */
  public cadastrarPacienteDermato(pacienteDermato: PacienteDermato): Observable<any> {
    return this.http.post(`${URL_API}/api/pacienteDermato`, pacienteDermato);
  }

  /**
   * Método que retorna todos oa pacientes não auditados
   * @author André Pacheco
   */
  public obtemNaoAuditados (pag?: number, tam?: number) {
    if (pag === undefined) {
      pag = 0;
    }
    if (tam === undefined) {
      tam = 10;
    }
    return this.http.get (`${URL_API}/api/pacienteDermato/search/findByAuditadoFalse?size=${tam}&page=${pag}`);
  }

  /**
   * Método para atualizar o campo auditado do paciente
   * @param url Url do paciente a ser atualizado
   * @param auditado Booleano com o valor de auditado
   * @author André Pacheco
   */
  public atualizaAuditado (url: string, auditado: boolean): Observable<any> {

    console.log("URL:", url)

    const dados = {
      'auditado': auditado
    };
    return this.http.patch(url, dados);
  }

  /**
   * Método para retornar um paciente de acordo com o cartaoSUS do mesmo.
   * Neste caso retorna o paciente completo, com as lesoes e imagens que podem
   * estar cadastradas
   * @author André Pacheco
   * @param cartaoSUS String que representa o cartao do sus a ser retornado
   * @returns Um array de contendo os usuarios
   */
  public obtemPacCompletoPorCartaoSUS (cartaoSus: string): Observable<any> {
    return this.http.get(`${URL_API}/api/pacienteDermato/obtemPacCompletoPorCartaoSus?cartaoSus=${cartaoSus}`);
  }

  public obtemPorCartaoSUS (cartaoSus: string): Observable<any> {
    return this.http.get(`${URL_API}/api/pacienteDermato/search/findByCartaoSus?cartaoSus=${cartaoSus}`);
  }

  /**
   * @author Felipe Branquinho
   * Método para retornar todas as lesoes de um paciente a partir do link da api
   * @param lesoesUrl da api Página a ser buscada
   * @returns Um array de contendo os usuarios
   */
  public obtemLesoes (lesoesUrl: string): Observable<any> {
    return this.http.get(lesoesUrl);
  }

  /**
   * Método que retorna a quantidade de pacientes não sincronizados no sistema
   */
  public obtemNaoSicronizados (): Observable<any> {
    return this.http.get(`${URL_API}/api/pacienteDermato/search/countBySincronizarTrue`);
  }

  /**
   * Método para apagar uma paciente. Atenção, não apaga as lesoes do mesmo.
   * @param url String com a url do paciente a ser apagado
   * @author André Pacheco
   */
  public apagarPaciente (url: string): Observable<any> {
    return this.http.delete(url);
  }

  /**
   * @author Felipe Branquinho
   * Método para retornar todas as images da lesao de um paciente a partir do link da api
   * @param imagensUrl da api Página a ser buscada
   * @returns Um array de contendo os usuarios
   */
  public obtemImagens (imagensUrl: string): Observable<any> {
    return this.http.get(imagensUrl);
  }

  /**
   * Método obter todos os pacientes da dermato
   * @param tam qunatidade de amostras a serem retornadas
   * @param pag pagina a ser retornada
   * @author André Pacheco
   */
  public obtemTodos (tam=5, pag=0): Observable<any> {
    return this.http.get(`${URL_API}/api/pacienteDermato?&page=${pag}&size=${tam}`);
  }

  public statsDiagAgrupado (): Observable<any> {
    return this.http.get(`${URL_API}/api/estatistica/dermato/agrupaDiagnostico`);
  }

}
