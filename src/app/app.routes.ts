import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductosFormComponent } from './producto/components/productos-form/productos-form.component';
import { ProductosListComponent } from './producto/components/productos-list/productos-list.component';

export const routes: Routes = [
  // carga directa: '','home','**'
  // carga diferida: 'login','register'
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  {path:'producto', component: ProductosFormComponent},
  {path:'producto-list', component:ProductosListComponent},

  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
