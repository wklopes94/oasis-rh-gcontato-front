import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntidadesComponent } from './entidades.component';

const routes: Routes = [
  { path: '', component: EntidadesComponent },
  { path: 'tipocolaboradores', loadChildren: () => import('./tipocolaborador/tipocolaborador.module').then(m => m.TipocolaboradorModule) },
  { path: 'colaboradores', loadChildren: () => import('./colaborador/colaborador.module').then(m => m.ColaboradorModule) },
  { path: 'departamentos', loadChildren: () => import('./departamento/departamento.module').then(m => m.DepartamentoModule) },
  { path: 'extensoes', loadChildren: () => import('./extensao/extensao.module').then(m => m.ExtensaoModule) },
  { path: 'hotels', loadChildren: () => import('./hotel/hotel.module').then(m => m.HotelModule) },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntidadesRoutingModule { }
