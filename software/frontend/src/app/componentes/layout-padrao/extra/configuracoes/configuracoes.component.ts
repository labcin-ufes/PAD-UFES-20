import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfiguracoesService } from '../../../../servicos/configuracoes.service';
import { NgForm } from '@angular/forms';


@Component({
    selector: 'app-configuracoes',
    templateUrl: './configuracoes.component.html'
})

export class ConfiguracoesComponent implements OnInit {

    public urlConfiguracao = '';
    public flagViagem = false;


constructor (private configuracoesService: ConfiguracoesService) {
    }

    ngOnInit () {
        this.verficaViagemPad();
    }

    public verficaViagemPad (): void {
        this.configuracoesService.pegaConfiguracao('EM VIAGEM').
        subscribe(
          resp => {
            console.log('resp.status', resp.status);
            console.log('resp', resp._links.self.href);
            this.flagViagem = resp.status;
            this.urlConfiguracao = resp._links.self.href;
          },
          erro => {
            console.log('erro status', erro);
          }
        );
    }

    public alteraViagemPad (data: boolean): void {

        const dados = {
            'status': data
        };

        console.log('dados', dados);

        this.configuracoesService.salvaConfiguracao(this.urlConfiguracao, dados).
        subscribe(
            resp => {
                console.log('resp', resp);
            },
            erro => {
                console.log('erro', erro);
            }
        );

    }

}

