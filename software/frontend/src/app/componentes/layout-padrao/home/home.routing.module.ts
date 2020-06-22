import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';


const homeRoutes: Routes = [
    {
        path: '',
        data: {
            title: 'Home'
        },
        component: HomeComponent
    }
];

@NgModule({
  imports: [ RouterModule.forChild(homeRoutes) ],
  exports: [ RouterModule ]
})
export class HomeRoutingModule {}
