import { CirurgiaService } from './cirurgia.service';
import { RegiaoCorpoService } from './regiao-corpo.service';
import { DiagnosticoService } from './diagnostico.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CidadeService } from './cidade.service';
import { Injectable } from '@angular/core';
import { ProcedimentoService } from './procedimento.service';
import { EstadoService } from './estado.service';
import { ProfissaoService } from './profissao.service';
import { OrigemService } from './origem.service';

@Injectable({
  providedIn: 'root'
})
export class AutoCompletarService {

  constructor(
              private cidadeService: CidadeService,
              private diagnosticoService: DiagnosticoService,
              private regiaoCorpoService: RegiaoCorpoService,
              private cirurgiaService: CirurgiaService,
              private procedimentoService: ProcedimentoService,
              private estadoService: EstadoService,
              private profissaoService: ProfissaoService,
              private origemService: OrigemService,
  ) { }

  /**
   * Função para autocompletar nomes de cidades de acordo com o
   * termo passado como parametro. Deve ser utilizada em inputs que utilizam
   * o módulo [ngbTypeahead] do ng-bootstrap
   * @author André Pacheco
   */
  public completarCidade = (nome: Observable<string>) => {
    return nome.pipe(
                  debounceTime(400),
                  distinctUntilChanged(),
                  switchMap (
                    termo => this.cidadeService.obtemCidadePorNomeContendo(termo)
                  )
                );
  }

  /**
   * Função para autocompletar nomes de procedimentos de acordo com o
   * termo passado como parametro. Deve ser utilizada em inputs que utilizam
   * o módulo [ngbTypeahead] do ng-bootstrap
   * @author André Pacheco
   */
  public completarProcedimento = (nome: Observable<string>) => {
    return nome.pipe(
                  debounceTime(400),
                  distinctUntilChanged(),
                  switchMap (
                    termo => this.procedimentoService.obtemProcedimentoPorNomeContendo(termo)
                  )
                );
  }

  /**
   * Função para autocompletar nomes de diagnosticos de acordo com o
   * termo passado como parametro. Deve ser utilizada em inputs que utilizam
   * o módulo [ngbTypeahead] do ng-bootstrap
   * @author André Pacheco
   */
  public completarDiagnostico = (nome: Observable<string>) => {
    return nome.pipe(
                  debounceTime(400),
                  distinctUntilChanged(),
                  switchMap (
                    termo => this.diagnosticoService.obtemDiagPorNomeContendo(termo)
                  )
                );
  }

  /**
   * Função para autocompletar subtipos de diagnosticos de histopatológico
   *  de acordo com o termo passado como parametro.
   *  Deve ser utilizada em inputs que utilizam
   * o módulo [ngbTypeahead] do ng-bootstrap
   * @author Breno K
   */
  public completarSubtipoHisto = (nome: Observable<string>) => {
    return nome.pipe(
                  debounceTime(400),
                  distinctUntilChanged(),
                  switchMap (
                    termo => this.diagnosticoService.obtemDiagPorNomeContendo(termo, true)
                  )
                );
  }

  /**
   * Função para autocompletar nomes de regiões do corpo de acordo com o
   * termo passado como parametro. Deve ser utilizada em inputs que utilizam
   * o módulo [ngbTypeahead] do ng-bootstrap
   * @author André Pacheco
   */
  public completarRegiao = (nome: Observable<string>) => {
    return nome.pipe(
                  debounceTime(400),
                  distinctUntilChanged(),
                  switchMap (
                    termo => this.regiaoCorpoService.obtemRegiaoPorNomeContendo(termo)
                  )
                );
  }

  /**
   * Função para autocompletar nomes de cirurgioes de acordo com o
   * termo passado como parametro. Deve ser utilizada em inputs que utilizam
   * o módulo [ngbTypeahead] do ng-bootstrap
   * @author André Pacheco
   */
  public completarCirurgiao = (nome: Observable<string>) => {
    return nome.pipe(
                  debounceTime(400),
                  distinctUntilChanged(),
                  switchMap (
                    termo => this.cirurgiaService.obtemCirurgiaoPorNomeContendo(termo)
                  )
                );
  }

  /**
* Função para autocompletar nomes de estados de acordo com o
* termo passado como parametro. Deve ser utilizada em inputs que utilizam
* o módulo [ngbTypeahead] do ng-bootstrap
* @author Gabriel G
*/
  public completarEstado = (nome: Observable<string>) => {
    return nome.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(
        termo => this.estadoService.obtemEstadoPorNomeContendo(termo)
      )
    );
  }

  /**
* Função para autocompletar nomes de profissoes de acordo com o
* termo passado como parametro. Deve ser utilizada em inputs que utilizam
* o módulo [ngbTypeahead] do ng-bootstrap
* @author Gabriel G
*/
  public completarProfissao = (nome: Observable<string>) => {
    return nome.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(
        termo => this.profissaoService.obtemProfissaoPorNomeContendo(termo)
      )
    );
  }

  /**
* Função para autocompletar nomes de origem de acordo com o
* termo passado como parametro. Deve ser utilizada em inputs que utilizam
* o módulo [ngbTypeahead] do ng-bootstrap
* @author Gabriel G
*/
  public completarOrigem = (nome: Observable<string>) => {
    return nome.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(
        termo => this.origemService.obtemOrigemPorNomeContendo(termo)
      )
    );
  }
}
