import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { IdadePipe } from './../../../utils/pipes/idade.pipe';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TabsModule, TooltipModule, CarouselModule } from 'ngx-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap';
import { AuditoriaRoutingModule } from './auditoria.routing.module';
import { AppPipesModule } from '../../../utils/pipes/app-pipes-module';
import { AuditoriaDermatoComponent } from './dermato/auditoria-dermato.component';
import { AuditoriaCirurgiaComponent } from './cirurgia/auditoria-cirurgia.component';
import { AuditoriaListarComponent } from './listar/auditoria-listar.component';
import { AuditoriaListarLesoesComponent } from './listar/auditoria-listar-lesoes.component';
import { AuditoriaEdicaoComponent } from './edicao/auditoria-edicao.component';
import { AuditoriaEdicaoDermatoComponent } from './edicao/auditoria-edicao-dermato.component';
import { AuditoriaEdicaoCirurgiaComponent } from './edicao/auditoria-edicao-cirurgia.component';
import { AuditoriaEdicaoImagemComponent } from './edicao/auditoria-edicao-imagem.component';
import { ImageCropperModule } from 'ngx-image-cropper';



@NgModule({
    imports: [
        CommonModule,
        AuditoriaRoutingModule,
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
        AuditoriaDermatoComponent,
        AuditoriaCirurgiaComponent,
        AuditoriaListarComponent,
        AuditoriaListarLesoesComponent,
        AuditoriaEdicaoComponent,
        AuditoriaEdicaoDermatoComponent,
        AuditoriaEdicaoCirurgiaComponent,
        AuditoriaEdicaoImagemComponent
    ],
    providers: [
        DatePipe
    ],
    exports: [
        IdadePipe
    ]
})
export class AuditoriaModule { }
