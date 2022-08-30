
import { NgModule } from '@angular/core';


import { TipocolaboradorRoutingModule } from './tipocolaborador-routing.module';
import { TipocolaboradorComponent } from './tipocolaborador.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { ListarComponent } from './components/crud/listar/listar.component';
import { ApagarComponent } from './components/crud/apagar/apagar.component';

import { WebSharedModule } from 'src/app/my-shared/modules/web-shared/web-shared.module';
import { MaterialSharedModule } from 'src/app/my-shared/modules/material-shared/material-shared.module';
import { ComponentsSharedModule } from 'src/app/my-shared/modules/components-shared/components-shared.module';
import { CriaralterarComponent } from './components/crud/criaralterar/criaralterar.component';
import { TipocolaboradorCrudService } from './services/tipocolaborador-crud.service';
import { AlterarComponent } from './components/crud/alterar/alterar.component';

@NgModule({
  declarations: [
    TipocolaboradorComponent,
    MainMenuComponent,
    ListarComponent,
    ApagarComponent,
    CriaralterarComponent,
    AlterarComponent,

  ],
  imports: [
    WebSharedModule,
    MaterialSharedModule,
    ComponentsSharedModule,
    TipocolaboradorRoutingModule
  ],
  providers: [
    TipocolaboradorCrudService
  ]
})
export class TipocolaboradorModule { }
