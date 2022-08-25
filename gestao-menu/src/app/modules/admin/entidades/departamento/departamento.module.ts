
import { NgModule } from '@angular/core';

import { DepartamentoRoutingModule } from './departamento-routing.module';
import { DepartamentoComponent } from './departamento.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { ListarComponent } from './components/crud/listar/listar.component';
import { ApagarComponent } from './components/crud/apagar/apagar.component';
import { CriarComponent } from './components/crud/criar/criar.component';
import { AlterarComponent } from './components/crud/alterar/alterar.component';
import { WebSharedModule } from 'src/app/my-shared/modules/web-shared/web-shared.module';
import { MaterialSharedModule } from 'src/app/my-shared/modules/material-shared/material-shared.module';
import { ComponentsSharedModule } from 'src/app/my-shared/modules/components-shared/components-shared.module';
import { DepartamentoCrudService } from './services/departamento-crud.service';


@NgModule({
  declarations: [
    DepartamentoComponent,
    MainMenuComponent,
    ListarComponent,
    ApagarComponent,
    CriarComponent,
    AlterarComponent
  ],
  imports: [
    WebSharedModule,
    MaterialSharedModule,
    ComponentsSharedModule,
    DepartamentoRoutingModule,

  ],
  providers: [
    DepartamentoCrudService
  ]
})
export class DepartamentoModule { }
