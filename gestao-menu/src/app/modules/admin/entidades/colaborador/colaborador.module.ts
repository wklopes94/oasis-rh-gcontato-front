import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColaboradorRoutingModule } from './colaborador-routing.module';
import { ColaboradorComponent } from './colaborador.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { ListarComponent } from './components/crud/listar/listar.component';
import { ApagarComponent } from './components/crud/apagar/apagar.component';
import { CriarComponent } from './components/crud/criar/criar.component';
import { AlterarComponent } from './components/crud/alterar/alterar.component';
import { WebSharedModule } from 'src/app/my-shared/modules/web-shared/web-shared.module';
import { MaterialSharedModule } from 'src/app/my-shared/modules/material-shared/material-shared.module';
import { ComponentsSharedModule } from 'src/app/my-shared/modules/components-shared/components-shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ColaboradorCrudService } from './services/colaborador-crud.service';


@NgModule({
  declarations: [
    ColaboradorComponent,
    MainMenuComponent,
    ListarComponent,
    ApagarComponent,
    CriarComponent,
    AlterarComponent
  ],
  imports: [
    CommonModule,
    ColaboradorRoutingModule,
    WebSharedModule,
    MaterialSharedModule,
    ComponentsSharedModule,
    HttpClientModule
  ],
  providers: [
    ColaboradorCrudService,
  ]

})
export class ColaboradorModule { }
