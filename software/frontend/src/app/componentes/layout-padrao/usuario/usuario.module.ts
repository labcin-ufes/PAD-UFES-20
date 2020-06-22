import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { UsuarioComponent } from './usuario.component';
import { NovoUsuarioComponent } from './novo-usuario/novo-usuario.component';
import { VisualizarUsuarioComponent } from './visualizar-usuario/visualizar-usuario.component';
import { UsuarioRoutingModule } from './usuario.routing.module';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';

@NgModule({
    imports: [
        CommonModule,
        UsuarioRoutingModule,
        CollapseModule,
        FormsModule,
        PopoverModule.forRoot(),
        PaginationModule.forRoot(),
        BsDropdownModule.forRoot()
    ],
    declarations: [
        UsuarioComponent,
        NovoUsuarioComponent,
        VisualizarUsuarioComponent,
        EditarUsuarioComponent
    ]
})
export class UsuarioModule { }
