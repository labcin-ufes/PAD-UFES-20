import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from './../utils/url-api';
import PacienteCirurgia from '../modelo/PacienteCirurgia';

@Injectable({
  providedIn: 'root'
})
export class PacienteCirurgiaService {

  private pacienteCirurgia: PacienteCirurgia;

  constructor(private http: HttpClient) { }

  /**
   * Método que retorna todos os pacientes da cirurgia
   * @author André Pacheco
   */
  public obtemPacientesCirurgia (): Observable<any> {
    return this.http.get (`${URL_API}/api/pacienteCirurgia`);
  }

  /**
   * Método para apagar uma paciente.
   * @param url String com a url do paciente a ser apagado
   * @author André Pacheco
   */
  public apagarPaciente (url: string): Observable<any> {
    return this.http.delete(url);
  }

  /**
   * Método para atualizar o campo auditado do paciente
   * @param url Url do paciente a ser atualizado
   * @param auditado Booleano com o valor de auditado
   * @author André Pacheco
   */
  public atualizaAuditado (url: string, auditado: boolean): Observable<any> {
    const dados = {
      'auditado': auditado
    };
    return this.http.patch(url, dados);
  }

  /**
   * Método para atualizar o campo sincronizar do paciente
   * @param url Url do paciente a ser atualizado
   * @param auditado Booleano com o valor de auditado
   * @author André Pacheco
   */
  public atualizaSincronizar (url: string, sincronizar: boolean): Observable<any> {
    const dados = {
      'sincronizar': sincronizar
    };
    return this.http.patch(url, dados);
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
    return this.http.get (`${URL_API}/api/pacienteCirurgia/search/findByAuditadoFalse?size=${tam}&page=${pag}`);
  }

  /**
   * @author Gabriel G
   * Método para cadastrar um paciente da cirurgia no sistema
   * @param pacienteCirurgia Paciente da cirurgia a ser cadastrado no sistema
   */
  public cadastrarPacienteCirurgia(pacienteCirurgia: PacienteCirurgia): Observable<any> {
    return this.http.post(`${URL_API}/api/pacienteCirurgia`, pacienteCirurgia);
  }

  /**
   * @author Gabriel G
   * Método para atualizar um paciente da cirurgia no sistema
   * @param pacienteCirurgia Paciente da cirurgia a ser atualizado no sistema
   * @param url url referente ao paciente a ser atualizado
   */
  public atualizarPacienteCirurgia(pacienteCirurgia: PacienteCirurgia, url: string): Observable<any> {
    return this.http.put(url, pacienteCirurgia);
  }

/**
   * Método para atualizar um ou mais campos de um Paciente
   * @param url String com a url do paciente que deve ser atualizado
   * @param pacienteCirurgia Paciente da cirurgia a ser cadastrado no sistema
   * @author André Pacheco
   */
  public adicionarLesao (pacienteCirurgia: PacienteCirurgia): Observable<any> {
    return this.http.post(`${URL_API}/api/pacienteCirurgia/adicionarLesao`, pacienteCirurgia);
  }

  /**
   * Método para retornar um paciente de acordo com o cartaoSUS do mesmo
   * @author Felipe Branquinho
   * @param cartaoSUS Página a ser buscada
   * @returns Um array de contendo os usuarios
   */
  public obtemPorCartaoSUS (cartaoSus: string): Observable<any> {
    return this.http.get(`${URL_API}/api/pacienteCirurgia/search/findByCartaoSus?cartaoSus=${cartaoSus}`);
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
    return this.http.get(`${URL_API}/api/pacienteCirurgia/obtemPacCompletoPorCartaoSus?cartaoSus=${cartaoSus}`);
  }

  /**
   * Método que retorna a quantidade de pacientes não sincronizados no sistema
   */
  public obtemNaoSicronizados (): Observable<any> {
    return this.http.get(`${URL_API}/api/pacienteCirurgia/search/countBySincronizarTrue`);
  }

  /**
   * @author André Pacheco
   * Método para filtrar os dados de uma paciente. Somente a página e o tamanho da mesma é obrigatório.
   * Os demais campos podem ou nao serem preenchidos.
   * @param pagina Pagina a ser retornada
   * @param tam Numero de elementos da pagina retornada
   * @param dataInicial Filtragem pela data inicial
   * @param dataFinal Filtragem pela dataFinal
   * @param diagClinico Filtragem por diagnostico clinico
   * @param diagHisto  Filtragem por diagnostico histopatologico
   * @param localAtendimento Filtragem por local de atendimento
   * @param regiao Filtragem por região do corpo
   * @param nomePaciente Filtragem por nome do paciente
   * @param comLesao Filtrar se o paciente possui ou não uma lesao
   * @param comImagem Filtrar se o paciente possui ou nao uma imagem na lesão
   * @param padLocal Filtrar para um PAD ocorrendo no momento
   * @param semHisto Filtrar para pacientes sem histopatologico preenchido
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

        /*console.log(nomePaciente);
        console.log(localAtendimento);
        console.log(diagClinico);
        console.log(diagHisto);
        console.log(regiao);
        console.log(dataInicial);
        console.log(dataFinal);
        console.log(semLesao);
        console.log(semImagem);
        console.log(padLocal);*/

        const form = new FormData();
        form.append('page', pagina.toString());
        form.append('size', tam.toString());

        if (dataInicial !== undefined) {
          form.append('dataInicial', dataInicial);
        }
        if (dataFinal !== undefined) {
          form.append('dataFinal', dataFinal);
        }
        if (diagClinico !== undefined) {
          form.append('diagClinico', diagClinico);
        }
        if (diagHisto !== undefined) {
          form.append('diagHisto', diagHisto);
        }
        if (localAtendimento !== undefined) {
          form.append('localAtendimento', localAtendimento);
        }
        if (regiao !== undefined) {
          form.append('regiao', regiao);
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

        return this.http.post(`${URL_API}/api/filtro/pacienteCirurgia`, form);
  }
}
