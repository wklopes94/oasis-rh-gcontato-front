
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';






@NgModule({
  declarations: [],
  exports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,

  ]
})
export class WebSharedModule { }
