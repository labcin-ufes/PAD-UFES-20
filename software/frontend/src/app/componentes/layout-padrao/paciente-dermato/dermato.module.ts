import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DermatoComponent } from './dermato.component';
import { NovoPacienteComponent } from './novo-paciente/novo-paciente.component';
import { DermatoRoutingModule } from './dermato.routing.module';
import { NgxMaskModule } from 'ngx-mask';
import { PopoverModule, PaginationModule, BsDropdownModule, TooltipModule,
    CarouselModule, TabsModule, CollapseModule } from 'ngx-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppPipesModule } from '../../../utils/pipes/app-pipes-module';

import { ModalModule } from 'ngx-bootstrap';
import { VisualizarPacienteComponent } from './visualizar-paciente/visualizar-paciente.component';
import { ModalContentComponent } from './visualizar-paciente/modal-content/modal-content.component';
import { NovaLesaoDermatoComponent } from './nova-lesao/nova-lesao-dermato.component';
import { PainelLesoesModule } from '../painel-lesoes/painel-lesoes.module';
import { PainelLesoesDermatoComponent } from './painel-lesoes-dermato/painel-lesoes-dermato.component';
import { EstatisticasDermato } from './estatisticas/estatistica-dermato.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
    imports: [
        CommonModule,
        DermatoRoutingModule,
        CollapseModule,
        FormsModule,
        PopoverModule.forRoot(),
        PaginationModule.forRoot(),
        BsDropdownModule.forRoot(),
        NgxMaskModule.forRoot(),
        NgbModule,
        TooltipModule.forRoot(),
        TabsModule.forRoot(),
        CarouselModule.forRoot(),
        ModalModule.forRoot(),
        AppPipesModule,
        PainelLesoesModule,
        ChartsModule

    ],
    declarations: [
        DermatoComponent,
        NovoPacienteComponent,
        NovaLesaoDermatoComponent,
        VisualizarPacienteComponent,
        ModalContentComponent,
        PainelLesoesDermatoComponent,
        EstatisticasDermato
    ],
    entryComponents: [
        ModalContentComponent
    ]
})
export class DermatoModule { }
