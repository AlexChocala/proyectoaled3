import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductosFormComponent } from './producto/components/productos-form/productos-form.component';
import { ProductosListComponent } from './producto/components/productos-list/productos-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'producto', component: ProductosFormComponent },
  { path: 'producto-list', component: ProductosListComponent },

  {
    path: 'login',
    loadComponent: () =>
      import('./usuario/components/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./usuario/components/register/register.component').then(m => m.RegisterComponent),
  },

  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];