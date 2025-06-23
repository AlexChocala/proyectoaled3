import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductosFormComponent } from './producto/components/productos-form/productos-form.component';
import { ProductosListComponent } from './producto/components/productos-list/productos-list.component';
import { RegistrarComponent } from './usuario/components/registrar/registrar.component';
import { LoginComponent } from './usuario/components/login/login.component';
import { FacturaComponent } from './factura/factura.component';

export const routes: Routes = [
  // carga directa: '','home','**'
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  {path:'producto', component: ProductosFormComponent},
  {path:'producto-list', component:ProductosListComponent},

  {path:'login', component:LoginComponent},
  {path:'registrar', component:RegistrarComponent},

  {path:'factura' ,component:FacturaComponent},
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
