import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AnaliseDadosRoutingModule } from './analise-dados.routing.module';
import { AnaliseDadosHomeComponent } from './home/analise-dados-home.component';


@NgModule({
    imports: [
        CommonModule,
        AnaliseDadosRoutingModule,
        CollapseModule,
        FormsModule,
        PopoverModule.forRoot(),
        PaginationModule.forRoot(),
        BsDropdownModule.forRoot(),
        NgxMaskModule.forRoot(),
        NgbModule
    ],
    declarations: [
        AnaliseDadosHomeComponent
    ]
})
export class AnaliseDadosModule { }
