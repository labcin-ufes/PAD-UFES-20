import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { BsDropdownModule, PaginationModule, PopoverModule, CarouselModule } from 'ngx-bootstrap';

import { PainelLesoesComponent } from './painel-lesoes.component';
import { PainelLesoesRoutingModule } from './painel-lesoes.routing.module';

@NgModule({
    imports: [
        CommonModule,
        BsDropdownModule,
        PainelLesoesRoutingModule,
        NgbModule,
        FormsModule,
        PaginationModule.forRoot(),
        PopoverModule.forRoot(),
        CarouselModule.forRoot()
    ],
    declarations: [
        PainelLesoesComponent
    ],
    exports: [
        PainelLesoesComponent
    ]
})
export class PainelLesoesModule { }
