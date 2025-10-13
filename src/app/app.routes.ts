import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegistrarComponent } from './usuario/components/registrar/registrar.component';
import { LoginComponent } from './usuario/components/login/login.component';
import { authGuard as AuthGuard } from './usuario/guards/auth.guard';
import { ChatComponent } from './chat/components/chat.component';
import { ProductosListComponent } from './producto/components/productos-list/productos-list.component';
import { ReporteComponent } from './administrador/reporte/components/reporte/reporte.component';
import { CarritoComponent } from './carrito/components/carrito/carrito.component';
import { PruebitaComponent } from './producto/shared/cotizacion-dolar/pruebita/pruebita.component';

export const routes: Routes = [

  // Redirección inicial: si entra a '/', lo lleva a '/home'
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Página principal
  { path: 'home', component: HomeComponent },

  //------PRODUCTOS------
  { path: 'producto', component: ProductosListComponent },
  //------PRODUCTOS ------

  //------USUARIO 👤------
  { path: 'iniciar_sesion', component: LoginComponent },
  { path: 'registrarse', component: RegistrarComponent },
  //----USUARIO👤-----

  //---superUsuario 👤--
  { path: 'reporte', component: ReporteComponent, canActivate: [AuthGuard] },
  //---superUsuario👤--

  //---CHAT-- 
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
  //---CHAT--

  // Carrito de compras
  { path: 'carrito', component: CarritoComponent },



  { path: 'pruebita', component: PruebitaComponent},

  // Ruta comodín: cualquier otra URL redirige a home
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
