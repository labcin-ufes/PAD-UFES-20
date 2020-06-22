import { PacienteDermatoService } from '../../../../servicos/paciente-dermato.service';
import { Component } from '@angular/core';
import PacienteDermato from '../../../../modelo/PacienteDermato';



@Component({
  selector: 'app-novo-paciente',
  templateUrl: './novo-paciente.component.html',
  styleUrls: ['./novo-paciente.component.css'],
  providers: [ PacienteDermatoService ]
})

export class NovoPacienteComponent {

  public cartaoSus: string;
  public cartaoSusValido: boolean;
  public respReq: string;

  constructor (private pacienteDermatoService: PacienteDermatoService) {
    this.cartaoSusValido = false;
    this.respReq = undefined;
  }

  /**
   * Método chamado para validar o cartão do sus e liberar o
   * botão para buscá-lo via form
   * @author: André Pacheco
   */
  public validaCartaoSus (): void {
    if (this.cartaoSus.length === 18) {
        this.cartaoSusValido = true;
    } else {
        this.cartaoSusValido = false;
    }
  }

  /**
   * Método criado apenas para quando clicar no campo de busca, a resposta sumir do topo
   */
  public resetaRespPac (): void {
    this.respReq = undefined;
  }

  /**
   * Método que cadastra o paciente com o clique do botao
   * @author André Pacheco
   */
  public cadastraPac(): void {
    const pacDermato = new PacienteDermato ({'cartaoSus': this.cartaoSus});
    this.pacienteDermatoService.cadastrarPacienteDermato(pacDermato)
    .subscribe (
      () => {
        this.respReq = 'pac-cadastrado';
      },
      erro => {
        console.error();
        if (erro.status === 409) {
          this.respReq = 'pac-existe';
        } else {
          this.respReq = 'falha-req';
        }
      }
    );
  }
}
