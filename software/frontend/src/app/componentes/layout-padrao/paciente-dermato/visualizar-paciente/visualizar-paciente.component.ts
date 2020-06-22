import { Component, ViewChild, OnInit, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PacienteDermatoService } from '../../../../servicos/paciente-dermato.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalContentComponent } from './modal-content/modal-content.component';
import { logoB64 } from '../../../../utils/utils-logo-b64';
import Utils from '../../../../utils/utils';
import { LesaoDermatoService } from '../../../../servicos/lesao-dermato.service';
import { ImagemService } from '../../../../servicos/imagem.service';

// Para usar o JsPDF com autotable:
declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');

@Component({
  selector: 'app-visualizar-paciente',
  templateUrl: './visualizar-paciente.component.html',
  styleUrls: ['./visualizar-paciente.component.css']
})
export class VisualizarPacienteComponent implements OnInit {
  public paciente: any;
  public lesoes: any = null;
  public imagens: any = [];
  public flagSucesso: boolean;
  public flagFalha: boolean;

  // Esse decorador permite recuperar os dados do formulario no template html
  @ViewChild('dadosCadastroForm')
  public dadosCadastroForm: NgForm;
  public cartaoSusForm: string;
  public cartaoSusURL: string;
  public cartaoSUS: string;

  // flags para controle de divs
  public flagFalhaReq: boolean;
  public isRequisicaoURL: boolean;
  public cartaoSusValido: boolean;
  public pacienteNaoEncontrado: boolean;
  public modalRef: BsModalRef;

  public totalPaginas: number;
  public paginaAtual: number;
  public maxPagLinks: number;
  public totalItens: number;
  public itensPorPag: number;

  constructor(
      private pacienteDermatoService: PacienteDermatoService,
      private lesaoDermatoService: LesaoDermatoService,
      private imagemService: ImagemService,
      private router: Router,
      private actRouter: ActivatedRoute,
      private modalService: BsModalService
    ) { 
        this.cartaoSusValido = false;
        this.isRequisicaoURL = false;
        this.paginaAtual = 1;
        this.maxPagLinks = 10;
        this.itensPorPag = 10;
     }

  ngOnInit() {
    const cartaoURL = this.actRouter.snapshot.params['cartaoSus'];

    // checando se o cartão foi passado via URL e se ele é válido
    if (cartaoURL !== undefined) {
        this.isRequisicaoURL = true;
        if (cartaoURL.length === 18) {
            this.cartaoSusURL = cartaoURL;
            this.cartaoSusValido = true;
            this.buscarPacienteURL();
        } else {
            this.cartaoSusURL = 'invalido';
            this.cartaoSusValido = false;

         }
    }
    console.log(this.cartaoSusValido);
    console.log(this.cartaoSusURL);
  }

  public validaCartaoSus(): void {
    if (this.cartaoSusForm.length === 18) {
        this.cartaoSusValido = true;
    } else {
        this.cartaoSusValido = false;
    }
}

public buscarPacienteCartao(): void {
    this.pacienteNaoEncontrado = false;
    this.cartaoSUS = this.cartaoSusForm;
    this.buscarPaciente(this.cartaoSusForm);
}

public buscarPacienteURL(): void {
    this.pacienteNaoEncontrado = false;
    this.cartaoSUS = this.cartaoSusURL;
    this.buscarPaciente(this.cartaoSusURL);
}

/**
   * @author Breno K
   * @param cartao cartão sus do paciente
   * Método para buscar paciente e suas lesoes através de cartao do sus
   */
  public buscarPaciente(cartao: string): void {
    this.pacienteDermatoService.obtemPacCompletoPorCartaoSUS(cartao).subscribe(
        resp => {
            if ( resp === null ) {
                this.pacienteNaoEncontrado = true;
                this.flagSucesso = false;
            } else {
                this.paciente = resp;
                console.log(resp);
                this.lesoes = null;
                this.mostraLesoes();
                this.flagFalhaReq = false;
                this.flagSucesso = true;
            }
        },
        erro => {
            if (erro.status === 404 || erro.status === 409) {
                this.pacienteNaoEncontrado = true;
            } else {
                this.flagFalhaReq = true;
            }
            this.flagSucesso = false;
        });
    }

    public mudaPagina(event: any): void {
        // Altera a página quando clicado no link
        this.paginaAtual = event.page;
        // sempre que o usuario trocar a pagina, pegamos a nova pagina dos dados
        this.mostraLesoes();
      }

  public mostraLesoes(): void {
    if ( this.lesoes !== null ) {
        return;
    }
    this.lesaoDermatoService.obtemLesaoPaginada( this.paciente.id, this.paginaAtual - 1, this.maxPagLinks )
    .subscribe(
        resp => {
            this.lesoes = resp._embedded.lesaoDermato;
            console.log(this.lesoes);
            this.totalItens = resp.page.totalElements;
            this.totalPaginas = resp.page.totalPages === 0 ? resp.page.totalPages + 1 : resp.page.totalPages;
            console.log(resp._embedded.lesaoDermato);
        }
    );
  }

  public abrirModal( lesao: any ): void {
    this.imagemService.obtemImagensUrl( lesao._links.imagens.href )
    .subscribe(
        resp => {
            this.imagens = resp._embedded.imagemDermato;
            console.log( this.imagens );
            const initialState = {lesao: lesao, imagens: this.imagens};
            this.modalRef = this.modalService.show(ModalContentComponent, {initialState});
        }
    );
  }

  public linkEditaPaciente(): void {
    this.router.navigateByUrl(`/dashboard/dermato/editar-paciente/${this.paciente.cartaoSus}`);
  }

    public gerarPDF(): void {
        this.escrevePDF();
    }

  public escrevePDF(): void {
      const sadeLogo = logoB64;

      const doc = new jsPDF();

      doc.addImage(sadeLogo, 'JPEG', 150, 15, 50, 15);

      doc.setFont('helvetica');
      doc.setFontType('bold');
      doc.setFontSize(22);
      doc.text(20, 20, 'Paciente');
      doc.line(20, 21, 52, 21);

    doc.setFontType('normal');
    doc.setFontSize(10);
    doc.text(20, 30, 'Cartão SUS: ' + this.paciente);

      const cabecalho = [[ 'Região', 'Diagnóstico', 'Diagnóstico Secundário', 'Cresceu', 'Coçou', 'Sangrou', 'Doeu', 'Mudou', 'Relevo', 'Idade', 'Obs.' ]];
      const corpo = new Array<any>();

      for( const lesao of this.lesoes ) {
          console.log(lesao);
          const lesaoPac = new Array<string>();
          lesaoPac.push( lesao.regiao );
          lesaoPac.push( lesao.diagnostico );
          lesaoPac.push( lesao.diagnosticoSecundario );
          lesaoPac.push( lesao.cresceu );
          lesaoPac.push( lesao.cocou );
          lesaoPac.push( lesao.sangrou );
          lesaoPac.push( lesao.doeu );
          lesaoPac.push( lesao.mudou );
          lesaoPac.push( lesao.relevo );
          lesaoPac.push( lesao.idade );
          lesaoPac.push( lesao.obs );
          corpo.push(lesaoPac);
      }

      doc.autoTable({
          startY: 40,
          head: cabecalho,
          body: corpo
      });
      doc.save();
  }
}
