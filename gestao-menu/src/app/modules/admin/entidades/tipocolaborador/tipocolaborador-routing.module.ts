import { CriaralterarComponent } from './components/crud/criaralterar/criaralterar.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListarComponent } from './components/crud/listar/listar.component';
import { TipocolaboradorComponent } from './tipocolaborador.component';

const routes: Routes = [{ path: '', component: TipocolaboradorComponent,

children: [

  { path: 'listar', component: ListarComponent },

  { path: 'criar', component: CriaralterarComponent },

]


}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipocolaboradorRoutingModule { }
