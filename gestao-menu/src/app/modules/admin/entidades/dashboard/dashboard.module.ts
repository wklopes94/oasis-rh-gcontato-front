import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { WebSharedModule } from 'src/app/my-shared/modules/web-shared/web-shared.module';
import { MaterialSharedModule } from 'src/app/my-shared/modules/material-shared/material-shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsSharedModule } from 'src/app/my-shared/modules/components-shared/components-shared.module';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    WebSharedModule,
    MaterialSharedModule,
    ComponentsSharedModule,
    HttpClientModule
  ]
})
export class DashboardModule { }
