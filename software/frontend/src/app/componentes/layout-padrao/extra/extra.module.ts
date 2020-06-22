import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SegmentarImagensComponent } from './segmentar-imagens/segmentar-imagens.component';
import { ExtraRoutingModule } from './extra.routing.module';
import { AtualizarSistemaComponent } from './atualizar-sistema/atualizar-sistema.component';
import { SicronizacaoComponent } from './sincronizacao/sincronizacao.component';
import { ConfiguracoesComponent } from './configuracoes/configuracoes.component';
import { ModalModule, TabsModule, TooltipModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { BackupComponent } from './backup/backup.component';
import { GerarDatasetComponent } from './gerar-dataset/gerar-dataset.component';
import { CanvasComponent } from './segmentar-imagens/Canvas/canvas.component';
import { PaginationModule } from 'ngx-bootstrap';

@NgModule({
    imports: [
        ExtraRoutingModule,
        CommonModule,
        ModalModule.forRoot(),
        NgxMaskModule.forRoot(),
        PaginationModule.forRoot(),
        FormsModule,
        TooltipModule.forRoot(),
        TabsModule.forRoot()
    ],
    declarations: [
        SegmentarImagensComponent,
        AtualizarSistemaComponent,
        SicronizacaoComponent,
        BackupComponent,
        GerarDatasetComponent,
        CanvasComponent,
        ConfiguracoesComponent
    ]
})
export class ExtraModule { }
