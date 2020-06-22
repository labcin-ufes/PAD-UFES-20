import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabsModule } from 'ngx-bootstrap/tabs';

import { HomeComponent } from './home.component';
import { AgendaComponent } from './agenda/agenda.component';
import { WidgetsComponent } from './widgets/widgets.component';
import { InfoMenuComponent } from './info-menu/info-menu.component';
import { HomeRoutingModule } from './home.routing.module';
import { AppPipesModule } from '../../../utils/pipes/app-pipes-module';

@NgModule({
    imports: [
        HomeRoutingModule,
        CommonModule,
        TabsModule,
        AppPipesModule
    ],
    declarations: [
        HomeComponent,
        AgendaComponent,
        WidgetsComponent,
        InfoMenuComponent
    ],
    exports: [
        HomeComponent
    ]
})
export class HomeModule { }
