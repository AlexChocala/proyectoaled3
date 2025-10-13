import { inject, Injectable } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Mensaje } from '../components/chat.component';
import { AuthService, Usuario } from '../../usuario/services/auth.service';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  /** Servicio requerido */
  private usuariosService = new FirestoreService<Usuario>('Usuarios');
  private mensajesService = new FirestoreService<Mensaje>('Mensajes');
  private authService = inject(AuthService);

  /** 🧩 NUEVO: contador de mensajes */
  private mensajesNuevosSubject = new BehaviorSubject<number>(0);
  mensajesNuevos$ = this.mensajesNuevosSubject.asObservable();

  /** Database */

  async enviarMensaje(text: string): Promise<void> {
    const usuarioId = this.authService.uid;
    if (!usuarioId) return;

    const usuario = await this.usuariosService.obtenerPorId(usuarioId);

    if (usuario) {
      console.log('Usuario encontrado:', usuario.nombre, usuario.rol);
    } else {
      console.log('Usuario no existe');
      return;
    }

    // Validar que tenga email y rol
    if (!usuario.email || !usuario.rol) {
      console.warn('Datos incompletos del usuario');
      return;
    }

    await this.mensajesService.agregar({
      text,
      timestamp: new Date(),
      rol: usuario.rol,
      email: usuario.email
    });
  }

  escucharMensajes(callback: (mensajes: { text: string; timestamp: Date; email: string; rol: string }[]) => void): void {
    this.mensajesService.escuchar(async mensajes => {
      const enriquecidos = mensajes.map(msg => ({
        text: msg.text,
        timestamp: msg.timestamp,
        email: msg.email,
        rol: msg.rol
      }));

      // 🧠 Contar solo mensajes de otros usuarios
      const emailActual = this.authService.emailActual;
      const nuevos = enriquecidos.filter(msg => msg.email !== emailActual);
      this.mensajesNuevosSubject.next(nuevos.length);

      callback(enriquecidos);
    });
  }

  /** 🧩 NUEVO: reiniciar contador manualmente */
  reiniciarContador(): void {
    this.mensajesNuevosSubject.next(0);
  }
}
