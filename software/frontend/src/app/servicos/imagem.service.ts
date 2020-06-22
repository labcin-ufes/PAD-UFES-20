import { URL_API } from './../utils/url-api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpFactory } from '@angular/http/src/http_module';
import Imagem from '../modelo/Imagem';
import Utils from '../utils/utils';



@Injectable({
  providedIn: 'root'
})
export class ImagemService {

  constructor(private http: HttpClient) { }

  /**
   * Método para linkar uma imagem a uma lesao
   * @param urlImg url da imagem que sera linkado
   * @param urlLesao url da lesao que vai linkar
   * @author André Pacheco
   */
  public linkarImagemCirurgiaLesao (urlImg: string, urlLesao: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'text/uri-list'
      })
    };
    return this.http.put (urlImg + '/lesao', urlLesao, httpOptions);
  }

  /**
   * Método para linkar uma imagem a uma lesao
   * @param urlImg url da imagem que sera linkado
   * @param urlLesao url da lesao que vai linkar
   * @author André Pacheco
   */
  public linkarImagemDermatoLesao (urlImg: string, urlLesao: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'text/uri-list'
      })
    };
    return this.http.put (urlImg + '/lesao', urlLesao, httpOptions);
  }

  /**
   * Método para salvar imagem Dermato no banco. Não salva no servidor!
   * @param img imagem a ser salva
   * @author André Pacheco
   */
  public salvarImagemDermato (img: Imagem): Observable<any> {
    img.adicionaFormatoImg('png');
    return this.http.post (`${URL_API}/api/imagemDermato`, img);
  }

  /**
   * Método para salvar imagem Cirurgia no banco. Não salva no servidor!
   * @param img imagem a ser salva
   * @author André Pacheco
   */
  public salvarImagemCirurgia (img: Imagem): Observable<any> {
    img.adicionaFormatoImg('png');
    return this.http.post (`${URL_API}/api/imagemCirurgia`, img);
  }

  /**
   * Método para salvar imagem no banco dado a url. Não salva no servidor!
   * @param url String com a url da imagem a ser salva
   * @param img imagem a ser salva
   * @author André Pacheco
   */
  public salvarImagemBanco (url: string, img: Imagem): Observable<any> {
    img.adicionaFormatoImg('png');
    return this.http.post (url, img);
  }
  /**
   * Método para linkar uma imagem a uma lesao
   * @param urlImg String com a url da imagem
   * @param urlLes Stirng com a url da lesao
   */
  public linkarImagemLesao (urlImg: string, urlLes: string): Observable<any> {

    // console.log(urlImg + '/lesao');
    // console.log(urlLes);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'text/uri-list'
      })
    };
    return this.http.put (urlImg + '/lesao', urlLes, httpOptions);
  }


  /**
   * Método para apagar a imagem do banco de dados. Ele não apaga do servidor!
   * @param url String com a url da lesao a ser salva
   * @author André Pacheco
   */
  public apagarImagemBanco (url: string): Observable<any> {
    return this.http.delete(url);
  }

  /**
   * Método para apagar a imagem do servidor. Não apaga do Banco!
   * @param nome String com o nome da imagem
   * @param tipo String com o tipo, ou seja, cirurgia, dermato, cirurgia-mask, dermato-mask
   * @author André Pacheco
   */
  public apagarImagemServidor (nome: string, tipo: string): Observable<any> {
    console.log('Apagando imagem: ', nome);
    const form = new FormData;
    form.append('nomeImg', nome);
    form.append('tipo', tipo);
    return this.http.post(`${URL_API}/api/imagem/remover`, form);
  }

  /**
   * Método para enviar as imagens para o servidor.
   * @author André Pacheco
   * @param dadosImgs Um array de objeto literal contendo os arquivos obtidos no input file da imagem
   *  e o nome gerado para a imagem. Esse objeto tem formato {'arquivo':..., 'nome':...}
   * @param tipoPaciente String com o tipo de paciente utilizado (cirurgia ou dermato)
   */
  public uploadImagem (dadosImgs: Object[], tipoPaciente: string, formato = 'png'): Observable<any> {
    const form = new FormData;

    for (const dadoImg of dadosImgs) {
      form.append('imagens', dadoImg['arquivo']);
      form.append('nomeImg', dadoImg['nome'] + '.' + formato);
    }
    form.append('tipoPaciente', tipoPaciente);

    // return this.http.post(`${URL_API}/api/imagem/upload`, form, {reportProgress: true});
    return this.http.post(`${URL_API}/api/imagem/upload`, form);

  }

  /**
   * Método para enviar uma imagem em base64 para o servidor
   * @param imgBase64 String com a imagem codificada
   * @param tipoPaciente tipo do paciente, dermato, cirurgia, dermato-mask, cirurgia-mask
   * @param nomeImg String com o nome da img
   */
  public uploadImagemBase64 (imgBase64: string, tipoPaciente: string, nomeImg: string, formato = 'png'): Observable<any> {
    const form = new FormData;
    form.append('imagens', Utils.base642Blob(imgBase64));
    if (formato.length > 0) {
      form.append('nomeImg', nomeImg + '.' + formato);
    } else {
      form.append('nomeImg', nomeImg);
    }
    form.append('tipoPaciente', tipoPaciente);

    return this.http.post(`${URL_API}/api/imagem/upload`, form);
    // Tive que parar de mandar como uma imagem com string por que estava estourando o tamanho de 
    // submissão
    //return this.http.post(`${URL_API}/api/imagem/uploadBase64`, form);
  }

  /**
   * Método para baixar as imagens do servidor
   * @param nomeImg String com nome da imagem a ser baixada
   * @param tipo String com tipo, ou seja, paciente, dermato ou sementacao
   * @param largura Number com a largura da imagem
   * @param altura Number com a altura da imagem
   * @author André Pacheco
   */
  public baixarImagem (nomeImg: string, tipo: string, largura?: number, altura?: number): Observable<any> {
    if (largura === undefined || altura === undefined) {
      return this.http.get(`${URL_API}/api/imagem/baixar?nomeImg=${nomeImg}&tipo=${tipo}`);
    } else {
      return this.http.get(`${URL_API}/api/imagem/baixar?nomeImg=${nomeImg}&tipo=${tipo}&largura=${largura}&altura=${altura}`);
    }
  }

  /**
   * Método para baixar as imagens em Base do servidor
   * @param nomeImg String com nome da imagem a ser baixada
   * @param tipo String com tipo, ou seja, paciente, dermato ou sementacao
   * @author André Pacheco
   */
  public baixarImagemBase64 (nomeImg: string, tipo: string): Observable<any> {
      return this.http.get(`${URL_API}/api/imagem/baixarBase64?nomeImg=${nomeImg}&tipo=${tipo}`);
  }

  /**
   * Obtem dados de  todas as imagens
   */
  public obtemImagens (): Observable<any> {
    return this.http.get(`${URL_API}/api/imagemCirurgia`);
  }

  public obtemImagensDermato (): Observable<any> {
    return this.http.get(`${URL_API}/api/imagemDermato`);
  }
 
  public obtemTodasImagensDermato (tam=5, pag=0): Observable<any> {    
    return this.http.get(`${URL_API}/api/imagemDermato?&page=${pag}&size=${tam}`);
  }

   /**
   * @author Felipe Branquinho
   * Método para retornar todas as images da lesao de um paciente a partir do link da api
   * @param imagensUrl da api Página a ser buscada
   */
  public obtemImagensUrl (imagensUrl: string): Observable<any> {
    return this.http.get(imagensUrl);
  }

   /**
   * @author Guilherme Esgario
   * Método para atualizar dados da imagem
   * @param url da imagem
   * @param dados dados da imagem a serem atualizados
   */
  public atualizarImagem(url: string, dados: object): Observable<any> {
    return this.http.patch(url, dados);
  }
}
