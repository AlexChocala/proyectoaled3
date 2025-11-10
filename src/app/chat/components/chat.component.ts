import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../usuario/services/auth.service'; // servicio de autenticación
import { Router } from '@angular/router'; // para redirigir al login
import { ChatService } from '../services/chat.service';

export interface Mensaje {
  id?: string;
  text: string;
  timestamp: Date;
  email: string;
  rol:string;
}

@Component({
  selector: 'app-chat-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  animations: [ // Animación de entrada del chat al cargar
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ChatComponent {

  /* servicios requeridos */
  private chatService: ChatService = inject(ChatService);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  /* datos */
  mensajes: any[] = [];
  nuevoMensaje: string = '';

  estaLogueado: boolean = false;

  ngOnInit(): void {
  // Suscribirse al usuario actual y obtener su nombre (displayName)
  this.authService.usuario$.subscribe(async usuario => {
    if (usuario) {
      this.estaLogueado = true;

      this.chatService.escucharMensajes(msgs => {
        this.mensajes = msgs;
        this.chatService.reiniciarContador(); // reinicia después de recibir

        this.mensajes.forEach((msg, index) => {
          console.log(`Mensaje ${index + 1}:`);
          console.log("Texto:", msg.text);
          console.log("Fecha:", msg.timestamp);
          console.log("Usuario ID:", msg.usuarioId);
          console.log("Usuario:", msg.usuario); // si está enriquecido
        });
      });

    } else {
      this.estaLogueado = false;
      }
    });

  }

  enviarMensaje(): void {
    if (this.nuevoMensaje.trim()) {
      this.chatService.enviarMensaje(this.nuevoMensaje);
      this.nuevoMensaje = '';
    }
  }

  irALogin() {
    this.router.navigate(['/iniciar_sesion']);
  }
}
