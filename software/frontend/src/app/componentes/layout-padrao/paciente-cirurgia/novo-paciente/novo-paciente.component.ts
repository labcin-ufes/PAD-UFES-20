import { AutoCompletarService } from './../../../../servicos/auto-completar.service';
import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PacienteCirurgiaService } from '../../../../servicos/paciente-cirurgia.service';
import PacienteCirurgia from '../../../../modelo/PacienteCirurgia';
import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-novo-paciente',
  templateUrl: './novo-paciente.component.html',
  styleUrls: ['./novo-paciente.component.css'],
  providers: [PacienteCirurgiaService]
})
export class NovoPacienteComponent implements OnInit {

  // Esse decorador permite recuperar os dados do formulario no template html
  @ViewChild('dadosCadastroForm')
  public dadosCadastroForm: NgForm;
  public flagRespostaCadastro: string;
  public local: string; // INCLUIR LOCAL
  public dataHoje: Date;
  public estado = 'ESPÍRITO SANTO';
  public agrotoxico = 'NENHUM';
  public origemMae = 'NÃO SABE';
  public origemPai = 'NÃO SABE';
  public observacoes = 'NENHUMA';
  public iniAlergia = 'NÃO';
  public pacienteCadastrado: string;
  public susCadastrado: string;
  public listaCidades = this.autoCompletarService.completarCidade;
  public listaEstados = this.autoCompletarService.completarEstado;
  public listaProfissoes = this.autoCompletarService.completarProfissao;
  public listaOrigem = this.autoCompletarService.completarOrigem;
  
  @Input()
  pacInput: any = null;
  pacienteResposta: any = null;
  public cartaoJaExiste = false;
  public pac: PacienteCirurgia = new PacienteCirurgia();

  @Output()
  public eventoPacAlterado = new EventEmitter<string>();

  @ViewChild('modalSucFalha')
  public modalSucFalha: ModalDirective;

  @ViewChild('modalPaciente')
  public modalPaciente: ModalDirective;

  @ViewChild('modalEdicao')
  public modalEdicao: ModalDirective;

  constructor(private pacienteCirurgiaService: PacienteCirurgiaService, private datePipe: DatePipe,
    private autoCompletarService: AutoCompletarService, private router: Router) {
    this.flagRespostaCadastro = 'false';
  }

  public buscaPacienteSus(sus: string): void {
    console.log(sus);
    if (sus && sus.length === 18) {
      this.pacienteCirurgiaService
      .obtemPorCartaoSUS(sus)
      .subscribe(
        resp => {
          console.log(resp);
          console.log(this.pacInput);
          if (this.pacInput !== null && resp._links.pacienteCirurgia.href !== this.pacInput._links.pacienteCirurgia.href) {
            this.cartaoJaExiste = true;
          } else if (this.pacInput === null) {
            this.modalPaciente.show();
            resp.numVezesAtendido = resp.numVezesAtendido + 1;
            resp.dataUltimoAtendimento = this.datePipe.transform(this.dataHoje, 'yyyy-MM-dd');
            this.dadosCadastroForm.reset(resp);
            this.pacienteResposta = resp;
          } else {
            this.cartaoJaExiste = false;
          }
        },
        erro => {
          this.cartaoJaExiste = false;
          console.log('Paciente não encontrado no banco. Logo, tem que cadastrar!');
          this.pacienteResposta = null;
        }
      );
    }
  }

  public finalizaCadastro(): void {
    if (this.pacInput === null) {
      this.modalSucFalha.show();
      this.recebeCadastroForm();
    } else {
      this.modalEdicao.show();
    }
  }

  public recebeCadastroForm(): void {
    console.log('Dados Form: ', this.dadosCadastroForm);
    const pacienteCirurgia: PacienteCirurgia = new PacienteCirurgia(
      this.dadosCadastroForm.value
    );

    console.log('Dados Pac: ', pacienteCirurgia);

    this.flagRespostaCadastro = 'false';

    if (this.pacInput !== null) {
      this.pacienteCirurgiaService
      .atualizarPacienteCirurgia(pacienteCirurgia, this.pacInput._links.pacienteCirurgia.href)
      .subscribe(
        resp => {
          this.flagRespostaCadastro = 'paciente-cadastrado';
          this.pacienteCadastrado = pacienteCirurgia.nomeCompleto;
          this.susCadastrado = pacienteCirurgia.cartaoSus;
          this.dadosCadastroForm.reset();
          this.modalFinalCadastro();
        },
          erro => {
            this.flagRespostaCadastro = 'problema-requisicao';
          }
        );
      } else if (this.pacienteResposta !== null) {
        this.pacienteCirurgiaService
        .atualizarPacienteCirurgia(pacienteCirurgia, this.pacienteResposta._links.pacienteCirurgia.href)
        .subscribe(
          resp => {
            this.flagRespostaCadastro = 'paciente-cadastrado';
            this.pacienteCadastrado = pacienteCirurgia.nomeCompleto;
            this.susCadastrado = pacienteCirurgia.cartaoSus;
            this.dadosCadastroForm.reset();
          },
          erro => {
            this.flagRespostaCadastro = 'problema-requisicao';
          }
        );
      } else {
      this.pacienteCirurgiaService
      .cadastrarPacienteCirurgia(pacienteCirurgia)
      .subscribe(
        resp => {
          this.flagRespostaCadastro = 'paciente-cadastrado';
          this.pacienteCadastrado = pacienteCirurgia.nomeCompleto;
          this.susCadastrado = pacienteCirurgia.cartaoSus;
          this.dadosCadastroForm.reset();
          this.inicializaDadosForm();
        },
        erro => {
          this.flagRespostaCadastro = 'problema-requisicao';
        }
      );
    }
  }

  ngOnInit(): void {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    if (this.pacInput !== null) {
      this.pac = new PacienteCirurgia(this.pacInput);
      this.local = this.pac.localUltimoAtendimento;
      this.dataHoje = this.pac.dataUltimoAtendimento;
      this.estado = this.pac.estadoNascimento;
      this.agrotoxico = this.pac.usoAgrotoxico;
      this.origemMae = this.pac.origemFamiliarMae;
      this.origemPai = this.pac.origemFamiliarPai;
      this.observacoes = this.pac.obs;
      this.iniAlergia = this.pac.alergia;
    } else {
      this.inicializaDadosForm();
    }
  }

  public inicializaDadosForm (): void {
    this.dataHoje = new Date();
    console.log(this.datePipe.transform(this.dataHoje, 'yyyy-MM-dd')); // output : 2018-02-13
    this.estado = 'ESPÍRITO SANTO';
    this.agrotoxico = 'NENHUM';
    this.origemMae = 'NÃO SABE';
    this.origemPai = 'NÃO SABE';
    this.observacoes = 'NENHUMA';
    this.iniAlergia = 'NÃO';
  }

  public modalFinalCadastro() {
    this.modalSucFalha.hide();
    if (this.pacInput !== null) {
      this.emitEventoPacAlterado(this.susCadastrado);
    }
  }

  /**
     * Essa função emite um evento com o sus do paciente alterado
     * @author Gabriel G
     * @param sus Sus do paciente alterado
     */
    public emitEventoPacAlterado (sus: string): void {
      this.router.navigate(['/dashboard/paciente-cirurgia/editar-paciente', sus]);
      this.modalSucFalha.hide();
      this.eventoPacAlterado.emit(sus);
    }
}
