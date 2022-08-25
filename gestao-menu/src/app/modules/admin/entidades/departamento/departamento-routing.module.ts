import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlterarComponent } from './components/crud/alterar/alterar.component';
import { ApagarComponent } from './components/crud/apagar/apagar.component';
import { CriarComponent } from './components/crud/criar/criar.component';
import { ListarComponent } from './components/crud/listar/listar.component';
import { DepartamentoComponent } from './departamento.component';

const routes: Routes = [{ path: '', component: DepartamentoComponent,

  children: [

    { path: 'listar', component: ListarComponent },

    { path: 'create', component: CriarComponent },

    { path: 'listar/update/:id', component: AlterarComponent },

    { path: 'listar/delete/:id', component: ApagarComponent },


  ]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartamentoRoutingModule { }
