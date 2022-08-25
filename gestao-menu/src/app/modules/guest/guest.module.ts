import { NgModule } from '@angular/core';
import { WebSharedModule } from './../../my-shared/modules/web-shared/web-shared.module';
import { MaterialSharedModule } from './../../my-shared/modules/material-shared/material-shared.module';

import { GuestRoutingModule } from './guest-routing.module';
import { GuestComponent } from './guest.component';




@NgModule({
  declarations: [
    GuestComponent
  ],
  imports: [
    WebSharedModule,
    MaterialSharedModule,
    GuestRoutingModule,
  ]
})
export class GuestModule { }
