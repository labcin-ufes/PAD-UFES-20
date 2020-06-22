import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SegmentarImagensComponent } from './segmentar-imagens/segmentar-imagens.component';
import { AtualizarSistemaComponent } from './atualizar-sistema/atualizar-sistema.component';
import { SicronizacaoComponent } from './sincronizacao/sincronizacao.component';
import { BackupComponent } from './backup/backup.component';
import { GerarDatasetComponent } from './gerar-dataset/gerar-dataset.component';
import { ConfiguracoesComponent } from './configuracoes/configuracoes.component';

const extraRoutes: Routes = [
    {
        path: '',
        data: {
            title: 'Extra'
        },
        children: [
            {
                path: 'segmentar-imagens/:urlLesao',
                component: SegmentarImagensComponent,
                data: { title: 'Segmentar Imagens' }
            },
            {
                path: 'segmentar-imagens',
                component: SegmentarImagensComponent,
                data: { title: 'Segmentar Imagens' }
            },
            {
                path: 'atualizar-sistema',
                component: AtualizarSistemaComponent,
                data: { title: 'Atualizar Sistema' }
            },
            {
                path: 'sincronizar-dados',
                component: SicronizacaoComponent,
                data: { title: 'Sincronizar dados' }
            },
            {
                path: 'backup-sistema',
                component: BackupComponent,
                data: { title: 'Backup' }
            },
            {
                path: 'gerar-dataset',
                component: GerarDatasetComponent,
                data: { title: 'Gerar Dataset' }
            },
            {
                path: 'configuracoes',
                component: ConfiguracoesComponent,
                data: { title: 'Configurações' }
            }
        ]
    }
];

@NgModule({
  imports: [ RouterModule.forChild(extraRoutes) ],
  exports: [ RouterModule ]
})
export class ExtraRoutingModule {}
