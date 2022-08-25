import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ColaboradorComponent } from './colaborador.component';
import { AlterarComponent } from './components/crud/alterar/alterar.component';
import { ApagarComponent } from './components/crud/apagar/apagar.component';
import { CriarComponent } from './components/crud/criar/criar.component';
import { ListarComponent } from './components/crud/listar/listar.component';

const routes: Routes = [{ path: '', component: ColaboradorComponent,

children: [

  { path: 'listar', component: ListarComponent },

  { path: 'create', component: CriarComponent },

  { path: 'update/:id', component: AlterarComponent },

  { path: 'delete/:id', component: ApagarComponent },


]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ColaboradorRoutingModule { }
