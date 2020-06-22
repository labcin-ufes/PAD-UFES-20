import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_API } from './../utils/url-api';
import LesaoCirurgia from '../modelo/LesaoCirurgia';


@Injectable({
  providedIn: 'root'
})
export class LesaoCirurgiaService {

  private lesaoCirurgia: LesaoCirurgia;

  constructor(private http: HttpClient) { }


  /**
   * Método para salvar uma lesão
   * @param lesao lesao a ser salva
   * @author André Pacheco
   */
  public salvaLesaoCirurgia (lesao: LesaoCirurgia): Observable<any> {
    return this.http.post (`${URL_API}/api/lesaoCirurgia`, lesao);
  }

  /**
   * Retorna uma lesão pegando pela URL
   * @param url String com a URL da lesao
   * @author André Pacheco
   */
  public obtemLesaoViaUrl (url: string): Observable<any> {
    return this.http.get(url);
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

    return this.http.put (urlLes + '/paciente', `${URL_API}/api/pacienteCirurgia/${pacId}`, httpOptions);
  }

  /**
   * @author Breno K
   * Método para atualizar lesao (adição de dados histopatologicos)
   * @param url da lesao e os dados da lesao a serem atualizados
   */
  public atualizarLesaoCirurgia(url: string, dados: object): Observable<any> {
    return this.http.patch(url, dados);
  }

  /**
   * Atualiza os dados da lesão fazendo um PUT. É necessário todas as informações
   * para isso ocorrer.
   * @param lesao LesãoCirurgia preenchida
   * @author Andre Pacheco
   */
  public atualizarLesaoPUT (lesao: LesaoCirurgia, url: string): Observable<any> {
    return this.http.put (url, lesao);
  }

  /**
   * @author Breno K
   * Método para obter lesoes de um paciente já cadastrado
   * @param url url das lesoes do paciente
   */
  public obtemLesoesPaciente(url: string): Observable <any> {
    return this.http.get(url);
  }

  /**
   * @author Felipe Branquinho
   * Método para obter lesoes de um paciente já cadastrado
   * @param pacienteId id do paciente desejado
   * @param page numero da pagina buscada
   * @param size numero maximo de objetos retornados
   */
  public obtemLesoesPaginada(pacienteId: string, page: number, size: number): Observable <any> {
    return this.http.get(`${URL_API}/api/lesaoCirurgia/search/findByPaciente?paciente=paciente/${pacienteId}&page=${page}&size=${size}`);
  }

  /**
   * Obtem lesões cirurgia
   * @author Guilherme Esgario
   * @param {...any[]} args
   * @returns {Observable<any>}
   */
  public obtemLesao(...args: any[]): Observable<any> {
    if (args.length === 0) {
      return this.http.get(`${URL_API}/api/lesaoCirurgia`);
    } else if (args.length === 1) {
      return this.http.get(`${URL_API}/api/lesaoCirurgia/${args[0]}`);
    } else {
      return this.http.get(`${URL_API}/api/lesaoCirurgia/${args[0]}/${args[1]}`);
    }
  }

  /**
   * Método que retorna todas as lesões sem histopatologico cadastradas no sistema
   * @author André Pacheco
   */
  public obtemLesoesSemHisto(): Observable<any> {
    return this.http.get(`${URL_API}/api/lesaoCirurgia/search/findByDiagnosticoHistoIsNull`);
  }

  /**
   * Método que retorna todos as lesões sem histopatologico cadastrado de um paciente especifico
   * @param pacId Number com o id do paciente
   * @author André Pacheco
   */
  public obtemLesoesSemHistoPorPaciente(pacId: number): Observable<any> {
    return this.http.get(`${URL_API}/api/lesaoCirurgia/search/findByPacienteAndDiagnosticoHistoIsNull?paciente=paciente/${pacId}`);
  }

  /**
   * Método para filtrar os dados das lesões de cirurgia.
   * Somente a página e o tamanho da mesma são obrigatórios.
   * Os demais campos podem ou não serem preenchidos.
   * @author Guilherme Esgario
   * @param pagina Pagina a ser retornada
   * @param tam Numero de elementos da pagina retornada
   * @param diagClinico Filtragem por diagnostico clinico
   * @param diagHisto  Filtragem por diagnostico histopatologico
   * @param regiao Filtragem por região do corpo
   * @returns {Observable<any>}
   */
  public filtragem (
    pagina: number,
    tam: number,
    diagClinico?: string,
    diagHisto?: string,
    regiao?: string,
    dataInicial?: string,
    dataFinal?: string,
    localAtendimento?: string,
    nomePaciente?: string,
    semLesao?: boolean,
    semImagem?: boolean,
    padLocal?: boolean,
    semHisto?: boolean
    ): Observable<any> {

      const form = new FormData();
      form.append('page', pagina.toString());
      form.append('size', tam.toString());

      if (diagClinico !== undefined) {
        form.append('diagClinico', diagClinico);
      }
      if (diagHisto !== undefined) {
        form.append('diagHisto', diagHisto);
      }
      if (regiao !== undefined) {
        form.append('regiao', regiao);
      }
      if (dataInicial !== undefined) {
        form.append('dataInicial', dataInicial);
      }
      if (dataFinal !== undefined) {
        form.append('dataFinal', dataFinal);
      }
      if (localAtendimento !== undefined) {
        form.append('localAtendimento', localAtendimento);
      }
      if (nomePaciente !== undefined) {
        form.append('nomePaciente', nomePaciente);
      }
      if (semLesao !== undefined) {
        if (semLesao) {
          form.append('semLesao', 'true');
        } else {
          form.append('semLesao', 'false');
        }
      }
      if (semImagem !== undefined) {
        if (semImagem) {
          form.append('semImagem', 'true');
        } else {
          form.append('semImagem', 'false');
        }
      }
      if (padLocal !== undefined) {
        if (padLocal) {
          form.append('padLocal', 'true');
        } else {
          form.append('padLocal', 'false');
        }
      }
      if (semHisto !== undefined) {
        if (semHisto) {
          form.append('semHisto', 'true');
        } else {
          form.append('semHisto', 'false');
        }
      }
      return this.http.post(`${URL_API}/api/filtro/lesaoCirurgia`, form);
    }
}


