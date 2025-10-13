import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, Usuario } from '../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';

export const authGuard: CanActivateFn = async (route) => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const usuarioService = new FirestoreService<Usuario>('Usuarios');

  const rutaActual = route.routeConfig?.path;

  // Permitir acceso libre al chat
  if (rutaActual === 'chat') return true;

  // Verificar si está logueado
  const uid = auth.uid;
  if (!uid) return router.createUrlTree(['/iniciar_sesion']);

  // Obtener datos del usuario actual
  const usuario = await usuarioService.obtenerPorId(uid);
  if (!usuario) return router.createUrlTree(['/iniciar_sesion']);

  // Verificar si la ruta requiere ser superUsuario
  const rutasProtegidas = ['factura', 'reporte'];
  if (rutasProtegidas.includes(rutaActual!) && usuario.rol !== 'superUsuario') {
    return router.createUrlTree(['/home']); // Redirige si no tiene permisos
  }

  return true;
};

