import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PacienteDermatoService } from '../../../../servicos/paciente-dermato.service';
import { AutoCompletarService } from '../../../../servicos/auto-completar.service';
import LesaoDermato from '../../../../modelo/LesaoDermato';
import PacienteDermato from '../../../../modelo/PacienteDermato';
import Utils from '../../../../utils/utils';
import { ImagemService } from '../../../../servicos/imagem.service';
import Imagem from '../../../../modelo/Imagem';
import { Guid } from 'guid-typescript';
import { LesaoDermatoService } from '../../../../servicos/lesao-dermato.service';

@Component({
  selector: 'app-nova-lesao-dermato',
  templateUrl: './nova-lesao-dermato.component.html',
  styleUrls: ['./nova-lesao-dermato.component.css'],
})
export class NovaLesaoDermatoComponent implements OnInit {

  @ViewChild('dadosLesao')
  public dadosLesao: any;

  @ViewChild('inputFile')
  public inputFile: any;

  public flagFalhaReqURL: boolean;
  public cartaoSusURL: string;
  public cartaoSusForm: string;
  public cartaoSusDefinido: string;
  public pacienteNaoEncontrado: boolean;
  public cartaoSusValido: boolean;
  public paciente: PacienteDermato;
  public lesao: LesaoDermato;
  public respUsuario: string;
  public imgValida: boolean;
  public imagensFile: any;
  public imagemEnviada: boolean;
  public imagens: Imagem[];

  // funcoes do auto completar
  public completarDiagnostico = this.autoCompletarService.completarDiagnostico;
  public completarRegiao = this.autoCompletarService.completarRegiao;
  public completarLocal = this.autoCompletarService.completarCidade;
  public completarCirurgiao = this.autoCompletarService.completarCirurgiao;
  public completarProcedimento = this.autoCompletarService.completarProcedimento;


  constructor(
    private route: ActivatedRoute,
    private pacienteDermatoService: PacienteDermatoService,
    private autoCompletarService: AutoCompletarService,
    private imagemService: ImagemService,
    private lesaoDermatoService: LesaoDermatoService
  ) {
    this.flagFalhaReqURL = false;
    this.pacienteNaoEncontrado = false;
    this.cartaoSusURL = undefined;
    this.cartaoSusValido = false;
  }

  ngOnInit () {
    const cartaoURL = this.route.snapshot.params['cartaoSus'];

    console.log('Cartao URL: ' + cartaoURL);

    // checando se o cartão foi passado via URL e se ele é válido
    if (cartaoURL !== undefined) {
        if (cartaoURL.length === 18) {
            this.cartaoSusURL = cartaoURL;
            this.buscarPacViaParam ();
        } else {
            this.cartaoSusURL = 'invalido';
        }
    }
  }

  /**
   * Método para resetar o alerta de paciente não encontrado no banco
   */
  public resetaAlert (): void {
      this.pacienteNaoEncontrado = false;
  }

  /**
   * Método chamado para validar o cartão do sus e liberar o
   * botão para buscá-lo via form
   */
  public validaCartaoSus (): void {
      if (this.cartaoSusForm.length === 18) {
          this.cartaoSusValido = true;
      } else {
          this.cartaoSusValido = false;
      }
  }

  /**
   * @author André Pacheco
   * Método que o botão de buscar chama para buscar o cartão do sus
   */
  public buscarPacViaBotao (): void {
      this.buscaPacCartaoSus(this.cartaoSusForm);
      this.respUsuario = undefined;
  }
  /**
   * @author André Pacheco
   * Método para buscar o paciente caso ele sejá passado via parametro na URL
   */
  public buscarPacViaParam (): void {
      this.buscaPacCartaoSus(this.cartaoSusURL);
  }

  /**
   * @author André Pacheco
   * Método para buscar no banco o paciente de acordo com o cartao do sus
   * @param cartao String com o cartão do sus
   */
  public buscaPacCartaoSus (cartao: string): void {
      this.cartaoSusDefinido = cartao;
      this.pacienteDermatoService.obtemPacCompletoPorCartaoSUS(cartao)
      .subscribe (
          resp => {

              // nesse caso o paciente nao esta cadastrado no banco
              if (resp === null) {
                  this.pacienteNaoEncontrado = true;
                  this.paciente = undefined;
              } else {
                  this.pacienteNaoEncontrado = false;
                  this.paciente = new PacienteDermato (resp);
                  console.log(this.paciente);
              }
          },
          erro => {
              if (erro.status === 404 || erro.status === 409) {
                  this.pacienteNaoEncontrado = true;
                  this.paciente = undefined;
              } else {
                  this.flagFalhaReqURL = true;
              }
          }
      );
  }
  /**
   * Método para receber os dados da lesão
   * @author André Pacheco
   */
  public recebeDadosLesao (): void {
    let dados = {
      'cocou': Utils.parseFiltros(this.dadosLesao.value.cocou, true),
      'cresceu': Utils.parseFiltros(this.dadosLesao.value.cresceu, true),
      'diagnostico': this.dadosLesao.value.diagnostico,
      'diagnosticoSecundario': this.dadosLesao.value.diagnosticoSecundario,
      'doeu': Utils.parseFiltros(this.dadosLesao.value.doeu, true),
      'mudou': Utils.parseFiltros(this.dadosLesao.value.mudou, true),
      'obs': this.dadosLesao.value.obs,
      'regiao': this.dadosLesao.value.regiao,
      'relevo': Utils.parseFiltros(this.dadosLesao.value.relevo, true),
      'sangrou': Utils.parseFiltros(this.dadosLesao.value.sangrou, true),
      'idade': this.dadosLesao.value.idade
    };

    // preparando os dados da lesão para envio
    const lesPrep = this.preparaLesao(this.dadosLesao.value);
    this.lesao = lesPrep['lesao'];
    this.imagens = lesPrep['imagens'];

    // Fazendo o upload da imagem para o servidor
    if (lesPrep['imagensComNome'].length !== 0) {
        // se houver imagem, ele envia ela e na sequencia ja submente os dados do paciente
        // apos a requisicao
        this.uploadImagensServidor(lesPrep['imagensComNome']);
    } else {
        // se nao houver imagem, manda so os dados do paciente
        this.enviaDadosPaciente();
    }

    
    this.inputFile.nativeElement.value = '';
    // resetando o formulario
    // Precisa setar todos os checkbox para False. Caso contrário, eles vão dar problema
    // se for enviado uma nova lesão (serão null)
    dados.cocou = false; dados.cresceu = false; dados.diagnostico = '';
    dados.diagnosticoSecundario = ''; dados.doeu = false; dados.mudou = false;
    dados.obs = ''; dados.regiao = ''; dados.relevo = false; dados.sangrou = false;
    dados.idade = null;
    this.dadosLesao.reset(dados);

  }

  /**
   * Método que recebe os dados da(s) imagens(em) quando o usuário as seleciona
   * no form de submissão
   * @author André Pacheco
   * @param event Evento retornado no momento do envio
   */
  public recebeImagensInput (event: any): void {

    for (const ev of event.target.files) {
        // pegando o time para saber se é uma imagem
        const tipo = ev.type.split('/', 2)[0];
        if (tipo !== 'image') {
            this.imgValida = false;
            break;
        } else {
            this.imgValida = true;
            // verificando se o tamanho passa
            if (ev.size / (1024 * 1024) > 15.5) {
                this.imgValida = false;
                this.respUsuario = 'imagem-grande';
            }
        }
    }
    // se todas forem válidas, a lista é preenchida, caso contrário, muda pra undefined
    if (this.imgValida) {
        this.imagensFile = event.target.files;
    } else {
        this.imagensFile = undefined;
    }
  }

 /**
 * Método para enviar os pacientes para o servidor
 * @author André Pacheco
 */
  private enviaDadosPaciente (): void {
    this.lesao.setPacienteId (this.paciente.getId());

    this.lesaoDermatoService.salvaLesaoDermato(this.lesao)
    .subscribe(
        resp => {
            const urlLesao = resp._links.self.href;
            this.lesaoDermatoService.linkarPacienteLesao(urlLesao, this.paciente.getId())
            .subscribe(
                resp2 => {
                    if (this.imagens.length !== 0) {
                        this.salvarImagens(this.imagens, urlLesao);
                    } else {
                        this.respUsuario = 'pac-salvo';
                        // apenas para atualizar os dados do paciente
                        this.buscaPacCartaoSus (this.cartaoSusDefinido);
                    }
                },
                erro => this.respUsuario = 'erro-salvar-pac'
            );
        },
        erro => {
            this.respUsuario = 'erro-salvar-pac';
        }
    );
}

  /**
   * Método para salvar uma ou mais imagens no servidor
   * @author André Pacheco
   */
  private salvarImagens (imagens: Imagem[], urlLesao: string): void {

    for (const img of imagens) {

        this.imagemService.salvarImagemDermato(img)
        .subscribe(
            resp => {
                const urlImg = resp._links.self.href;
                this.imagemService.linkarImagemDermatoLesao(urlImg, urlLesao)
                .subscribe(
                    () => {
                        this.respUsuario = 'pac-salvo';
                        // apenas para atualizar os dados do paciente
                        this.buscaPacCartaoSus (this.cartaoSusDefinido);
                    },
                    () => {
                        this.respUsuario = 'erro-salvar-pac';
                    }
                );
            },
            () => this.respUsuario = 'erro-salvar-pac'
        );
    }
  }

  /**
   * Método que realiza o upload das imagens no servidor.
   * @param dadosImg Array de objeto literal contendo os arquivos das imagens e o nome delas gerados
   * @author André Pacheco
   */
  private uploadImagensServidor (dadosImg: Object[]): void {
    this.imagemService.uploadImagem(dadosImg, 'dermato')
    .subscribe(
        resp => {
            console.log('Resposta imagem upload: ' + resp.estado);
            if (resp.estado === 'imagem-salva') {
                this.imagemEnviada = true;
                // se deu tudo certo, agora o paciente é atualizado
                // Essa atualização tem que ser feita aqui dentro por conta
                // de sincronia das operações
                this.enviaDadosPaciente();

            } else {
                this.respUsuario = 'erro-salvar-pac';
                this.flagFalhaReqURL = true;
            }
        },
        erro => {
            if (erro.status === 500) {
                this.respUsuario = 'imagem-muito-grande';
            }
            this.flagFalhaReqURL = true;
        }
    );
  }

  /**
   * Método que recebe os dados da lesão do formulário e prepara todo o envio da mesma
   * para o servidor. É criado os nomes para as imagens e preparado o objeto literal
   * de envio
   * @author André Pacheco
   * @param dadosLesao Array de Objeto literal com os dados da lesão advindos do formulario. Esse array tem que ter
   * formato {'arquivo':..., 'nome':...}
   * @returns Um objeto literal com uma Lesão preenchida (já com a imagem) e o array de objeto literal de envio dos dados
   * no formato {'lesao':..., 'imagensComNome':...}
   */
  private preparaLesao (dadosLesao: Object): Object {
    // setando a lesão a ser enviada
    const lesao = new LesaoDermato (dadosLesao);

    // Esse array vai guardar a imagem e o nome dela
    const imagensComFileNome = new Array<Object>();

    // Criando o array de imagem para colocar na lesão
    const imagensLesao = new Array<Imagem>();

    // setando imagens, caso tenha sido submetidas
    if (this.imgValida && this.imagensFile !== undefined) {

        for (const imgF of this.imagensFile) {
            // montando o objeto que será mandando para o serviço de envio da imagem
            const dadosImg = {
                'arquivo': imgF,
                'nome': this.paciente.getCartaoSus() + '_' + Guid.create()['value'] // cria um nome com id unico
            };
            // Inserindo a imagem no array que vai para o envio
            imagensComFileNome.push(dadosImg);

            // Criando o tipo imagem que vai para dentro de lesão
            const imgLes = new Imagem ();
            imgLes.setPath(dadosImg.nome);
            // Inserindo a imagem no array que vai para o envio
            imagensLesao.push(imgLes);
        }
    }
    return { 'lesao': lesao, 'imagensComNome': imagensComFileNome, 'imagens': imagensLesao};
  }

}
