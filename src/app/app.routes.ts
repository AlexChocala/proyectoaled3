import { Routes } from '@angular/router';
import { LoginComponent } from './usuarios/login/login.component';
import { RegisterComponent } from './usuarios/register/register.component';
import { HomeComponent } from './pages/home/home.component';

// constante de arrays de componentes con sus rutas
export const routes: Routes = [
  // ruta vacia _si o si al inicio
  { path: '', redirectTo: 'home', pathMatch:'full'},

  // ruta usuarios
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},

  //TODO ruta protegida  una vez ingresado usuario *auth
  {path:'home', component: HomeComponent},
  
  //ruta no definida _si o si aqui
  { path: '**', redirectTo: 'home', pathMatch:'full'},
];
