import { Component, ViewChild, OnInit, TemplateRef } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { GerarDatasetService } from '../../../../servicos/gerar-dataset.service';
import { HttpEventType } from '@angular/common/http';
import { ImagemService } from '../../../../servicos/imagem.service';
import { TabDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-gerar-dataset',
  templateUrl: './gerar-dataset.component.html'
})
export class GerarDatasetComponent implements OnInit {
  public flagSucesso: boolean;
  features: any = true;
  histoAll: any = false;
  pacCirurgiaAll: any = false;

  public sincronizando: string;
  public dadosGerados: string;

  featuresClass = [
    { id: 'atvPrincipal', name: 'Atividade principal', check: true },
    { id: 'usoCigarro', name: 'Uso de cigarro', check: true },
    { id: 'usoBebida', name: 'Uso de bebida', check: true },
    { id: 'origemFamiliarMae', name: 'Origem familiar da mãe', check: true },
    { id: 'origemFamiliarPai', name: 'Origem familiar do pai', check: true },
    { id: 'usoAgrotoxico', name: 'Uso de agrotóxico', check: true },
    { id: 'diabetes', name: 'Possui Diabétes', check: true },
    { id: 'sexo', name: 'Sexo', check: true },
    { id: 'aguaEncanada', name: 'Possui água encanada', check: true },
    { id: 'redeEsgoto', name: 'Possui rede de esgoto', check: true },
    { id: 'idadeInicioAtv', name: 'Idade de início das atividades', check: true },
    { id: 'destrofiaSolar', name: 'Destrofia solar', check: true },
    { id: 'expSol', name: 'Exposição sol', check: true },
    { id: 'horaExpSol', name: 'Tempo de exposição ao sol', check: true },
    { id: 'usoChapeu', name: 'Uso de chapéu', check: true },
    { id: 'usoMangaCumprida', name: 'Uso de manga cumprida', check: true },
    { id: 'usoCalcaCumprida', name: 'Uso de calça cumprida', check: true },
    { id: 'usoFiltroSolar', name: 'Uso de filtro solar', check: true },
    { id: 'histCancerPele', name: 'Histórico de câncer de pele', check: true },
    { id: 'histCancer', name: 'Histórico de câncer', check: true },
    { id: 'tipoPele', name: 'Tipo de pele', check: true },
    { id: 'usoAnticoagulante', name: 'Uso de anticoagulante', check: true },
    { id: 'diagnosticoClinico', name: 'Diagnóstico clínico', check: true },
    { id: 'diagnosticoClinicoSecundario', name: 'Diagnóstico clínico secundário', check: true },
    { id: 'presArtSistolica', name: 'Pressão arterial sistólica', check: true },
    { id: 'presArtDiastolica', name: 'Pressão arterial diastólica', check: true },
    { id: 'hipertensao', name: 'Hipertensão', check: true },
    { id: 'idade', name: 'Idade', check: true },
    { id: 'regiao', name: 'Região', check: true },
    { id: 'grandeRegiao', name: 'Região maior', check: true },
    { id: 'diagnosticoHisto', name: 'Diagnóstico histopatológico', check: true },
    { id: 'subtipoHisto', name: 'Subtipo histopatológico', check: true },
    { id: 'diametroMaior', name: 'Diâmetro maior', check: true },
    { id: 'diametroMenor', name: 'Diâmetro menor', check: true },
    { id: 'renda', name: 'Renda', check: true },
  ];

  pacienteCirurgia = [
    { id: 'cartaoSus', name: 'Cartão sus', check: false },
    { id: 'localUltimoAtendimento', name: 'Local do último atendimento', check: false },
    { id: 'dataUltimoAtendimento', name: 'Data do último atendimento', check: false },
    { id: 'dataNascimento', name: 'Data de nascimento', check: false },
    { id: 'prontuario', name: 'Prontuário', check: false },
    { id: 'nomeCompleto', name: 'Nome completo', check: false },
    { id: 'localNascimento', name: 'Local de nascimento', check: false },
    { id: 'estadoNascimento', name: 'Estado de nascimento', check: false },
    { id: 'nomeMae', name: 'Nome da mãe', check: false },
    { id: 'endereco', name: 'Endereço', check: false },
    { id: 'escolaridade', name: 'Escolaridade', check: false },
    { id: 'alergia', name: 'Alergia', check: false },
    { id: 'obs', name: 'Obs', check: false },
    { id: 'numPessoasCasa', name: 'Número de pessoas na casa', check: false },
    { id: 'estadoCivil', name: 'Estado civil', check: false },
    { id: 'numVezesAtendido', name: 'Número de atendimentos', check: false },
    { id: 'procedimento', name: 'Procedimento', check: false },
    { id: 'cirurgiao', name: 'Cirurgião', check: false },
    { id: 'dataProcedimento', name: 'Data do procedimento', check: false },
    { id: 'localProcedimento', name: 'Local do procedimento', check: false }
  ];

  histopatologico = [
    { id: 'clark', name: 'Clark', check: false },
    { id: 'breslow', name: 'Breslow', check: false },
    { id: 'indiceMiotico', name: 'Índice miótico', check: false },
    { id: 'tipoTumor', name: 'Tipo de tumor', check: false },
    { id: 'tamanhoTumorDimMaior', name: 'Tamanho do tumor maior', check: false },
    { id: 'tamanhoTumorDimMenor', name: 'Tamanho do tumor menor', check: false },
    { id: 'crescimentoRadial', name: 'Crescimento radial', check: false },
    { id: 'crescimentoVertical', name: 'Crescimento vertical', check: false },
    { id: 'ulceracao', name: 'Ulceração', check: false },
    { id: 'lesaoSatelite', name: 'Lesão satélite', check: false },
    { id: 'evidenciaRegressao', name: 'Evidência de regressão', check: false },
    { id: 'associacaoNevoMelanocito', name: 'Associação de nevo melanócito', check: false },
    { id: 'margemCirurgiaProfunda', name: 'Margem cirurgia profunda', check: false },
    { id: 'margemCirurgiaLateral', name: 'Margem cirurgia lateral', check: false },
    { id: 'margemProfundaLivre', name: 'Margem profunda livre', check: false },
    { id: 'margemLateralLivre', name: 'Margem lateral livre', check: false },
    { id: 'invasaoVascular', name: 'Invasão vascular', check: false },
    { id: 'menorDistMargemRessecaoLateral', name: 'Menor distância margem resseção lateral', check: false },
    { id: 'limiteRessecao', name: 'Limite resseção', check: false },
    { id: 'infiltracaoPerineural', name: 'Infiltração perineural', check: false },
    { id: 'infiltracaoAngiolinfatica', name: 'Infiltração angiolinfática', check: false },
    { id: 'infiltradoLinfocito', name: 'Infiltrado linfócito', check: false }
  ];

  pacienteDermato = [
    { id: 'regiao', name: 'Região', check: true },
    { id: 'grandeRegiao', name: 'Região maior', check: true },
    { id: 'diagnostico', name: 'Diagnóstico primário', check: true },
    { id: 'diagnosticoSecundario', name: 'Diagnóstico secundário', check: true },
    { id: 'cresceu', name: 'Se cresceu', check: true },
    { id: 'cocou', name: 'Se coçou', check: true },
    { id: 'sangrou', name: 'Se sangrou', check: true },
    { id: 'doeu', name: 'Se doeu', check: true },
    { id: 'mudou', name: 'Se mudou', check: true },
    { id: 'relevo', name: 'Relevo', check: true },
    { id: 'idade', name: 'Idade', check: true }
  ]

  constructor(
    private gerarDatasetService: GerarDatasetService,
    private imagemService: ImagemService,
  ) { 
    this.sincronizando = 'nao-comecou';
    this.dadosGerados = '0%';
  }

  ngOnInit() {
  }

  public selectAll() {
    for (var i=0; i < this.pacienteCirurgia.length; i++) {
      this.pacienteCirurgia[i].check = this.pacCirurgiaAll;
    }
    for (var i=0; i < this.featuresClass.length; i++) {
      this.featuresClass[i].check = this.features;
    }
    for (var i=0; i < this.histopatologico.length; i++) {
      this.histopatologico[i].check = this.histoAll;
    }
  }

  public checkifAllSelected() {
    this.pacCirurgiaAll = this.pacienteCirurgia.every(function(item: any) {
      return item.check == true;
    })
    this.features = this.featuresClass.every(function(item: any) {
      return item.check == true;
    })
    this.histoAll = this.histopatologico.every(function(item: any) {
      return item.check == true;
    })
  }

  public checkOpcao(p: any): void {
    p.check = !p.check;
  }

  public gerarDatasetCirurgia(path: string): void {
    var dados = '';
    this.pacienteCirurgia.forEach( function(p) {
      if(p.check) {
        dados +=  p.id + ',';
      }
    });
    this.featuresClass.forEach( function(p) {
      if(p.check) {
        dados +=  p.id + ',';
      }
    });
    this.histopatologico.forEach( function(p) {
      if(p.check) {
        dados +=  p.id + ',';
      }
    });
    dados += path;

    var numImages = 1;
    this.imagemService.obtemImagens().subscribe(
      resp => {
        if(path !== '') {
          console.log(resp);
          numImages = resp.page.totalElements === 0 ? numImages : resp.page.totalElements;
        }
      });

      const start = new Date();
      var finish = new Date();
      finish.setMilliseconds(finish.getMilliseconds() + 200*numImages);
      //console.log(finish.getTime());
      //console.log(start.getTime());
  
      this.sincronizando = 'gerando-dataset';
      this.gerarDatasetService.gerarDataset("cirurgia", dados).subscribe(
        (data) => {
  
          if (data.type === HttpEventType.DownloadProgress) {
            const now = new Date();
            console.log(data);
            /* console.log(now.getTime() - start.getTime());
            console.log(finish.getTime() - start.getTime()); */
            console.log(Math.round(100 * ((now.getTime() - start.getTime()) / (finish.getTime() - start.getTime()))));
            if (this.dadosGerados !== '100%') {
              const progressoTempo = Math.round(100 * (now.getTime() - start.getTime()) / (finish.getTime() - start.getTime()));
              this.dadosGerados = progressoTempo.toString() + '%';
              
              if (progressoTempo >= 100) {
                this.dadosGerados = '99%';
              }
              //console.log('enviado: ', this.dadosGerados);
            }
  
            const progresso = Math.round(100 * data.loaded / data.total);
            if(progresso === 100) {
              this.dadosGerados = progresso.toString() + '%';
              //console.log('enviado: ', this.dadosGerados);
            }
          }
  
          if (this.dadosGerados === '100%' && data.type === HttpEventType.Response) {
            const blob = new Blob([data.body], {
              type: 'application/zip'
            });
            console.log(blob);
            const url = URL.createObjectURL(blob);
            //window.open(url);
  
            const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
            a.href = url;
            a.download = 'dataset cirurgia.zip';
            document.body.appendChild(a);
            a.click();        
  
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            //this.deleteDataset("cirurgia");
          }
        });
  }

  public gerarDatasetDermato(path: string): void {
    var dados = '';
    this.pacienteDermato.forEach( function(p) {
      if(p.check) {
        dados +=  p.id + ',';
      }
    });
    dados += path;

    var numImages = 1;
    this.imagemService.obtemImagensDermato().subscribe(
      resp => {
        if(path != '') {
          numImages = resp.page.totalElements === 0 ? numImages : resp.page.totalElements;
        }
      }
    )

    const start = new Date();
    var finish = new Date();
    finish.setMilliseconds(finish.getMilliseconds() + 0.2*numImages);
    //console.log(finish.getTime());

    this.sincronizando = 'gerando-dataset';
    this.gerarDatasetService.gerarDataset("dermato", dados).subscribe(
      (data) => {
        const now = new Date();
        if (this.dadosGerados !== '100%') {
          const progressoTempo = Math.round(100 * (now.getTime() - start.getTime()) / (finish.getTime() - start.getTime()));
          this.dadosGerados = progressoTempo.toString() + '%';
          console.log('enviado: ', this.dadosGerados);
        }

        if (data.type === HttpEventType.DownloadProgress) {
          const progresso = Math.round(100 * data.loaded / data.total);
          if(progresso === 100) {
            this.dadosGerados = progresso.toString() + '%';
            console.log('enviado: ', this.dadosGerados);
          }
        }

        if (this.dadosGerados === '100%' && data.type === HttpEventType.Response) {
          const blob = new Blob([data.body], {
            type: 'application/zip'
          });
          const url = URL.createObjectURL(blob);
          //window.open(url);

          const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
          a.href = url;
          a.download = 'dataset dermato.zip';
          document.body.appendChild(a);
          a.click();        

          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          //this.deleteDataset("dermato");
        }
      }
    );
  }

  onSelect(data: TabDirective): void {
    this.sincronizando = 'nao-comecou';
    this.dadosGerados = '';
  }

  public deleteDataset(pacTipo: string): void {
    this.gerarDatasetService.deletaDataset(pacTipo).subscribe(
      (resp) => { console.log(resp); }
    );
  }

}
