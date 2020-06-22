import { IdadePipe } from './../../../utils/pipes/idade.pipe';
import { FiltrarPacienteCirurgiaComponent } from './filtrar/filtrar-paciente-cirurgia.component';
import { PacienteRoutingModule } from './paciente.routing.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TabsModule, TooltipModule, CarouselModule } from 'ngx-bootstrap';
import { NovoPacienteComponent } from './novo-paciente/novo-paciente.component';
import { VisualizarPacienteComponent } from './visualizar-paciente/visualizar-paciente.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NovaLesaoComponent } from './nova-lesao/nova-lesao.component';
import { NovoHistoComponent } from './novo-histo/novo-histo.component';
import { AppPipesModule } from '../../../utils/pipes/app-pipes-module';

import { ModalModule } from 'ngx-bootstrap';
import { EditarPacienteComponent } from './editar-paciente/editar-paciente.component';
import { EditarLesaoComponent } from './editar-paciente/editar-lesao/editar-lesao.component';
import { ModalContentComponent } from './visualizar-paciente/modal-content/modal-content.component';
import { NullDataPipe } from '../../../utils/pipes/null-data.pipe';
import { ImageCropperModule } from 'ngx-image-cropper';


@NgModule({
    imports: [
        CommonModule,
        PacienteRoutingModule,
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
        ImageCropperModule
    ],
    declarations: [
        FiltrarPacienteCirurgiaComponent,
        VisualizarPacienteComponent,
        NovoPacienteComponent,
        NovaLesaoComponent,
        NovoHistoComponent,
        EditarPacienteComponent,
        ModalContentComponent,
        EditarLesaoComponent,
    ],
    providers: [
        DatePipe
    ],
    exports: [
        IdadePipe,
        NullDataPipe
    ],
    entryComponents: [
        ModalContentComponent
    ]
})
export class PacienteModule { }
