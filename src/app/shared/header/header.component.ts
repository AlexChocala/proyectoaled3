import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../usuario/services/auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { trigger, transition, style, animate } from '@angular/animations';
import { CarritoService } from '../../carrito/services/carrito.service';
import { ChatService } from '../../chat/services/chat.service'; // NUEVO: para contador de mensajes
import { NotificacionesToastService } from '../../notificaciones/service/notificaciones-toast.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule,
    LucideAngularModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
  trigger('fadeSlideIn', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(-20px)' }),
      animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('400ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ]),
    trigger('dropdownAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class HeaderComponent {
  public navegacion = [
    { label: 'CHAT', path: '/chat', icon: 'message-circle' },
    { label: 'REPORTE', path: '/reporte', icon: 'bar-chart-3' },
  ];

  logueado = false;
  nombreUsuario: string = '';
  esSuperUsuario: boolean = false;
  mensajesNuevos = 0;
  menuMovilAbierto = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    public carrito: CarritoService,
    private chatService: ChatService,
    private toast: NotificacionesToastService
  ) {
    this.authService.usuario$.subscribe(async usuario => {
    this.logueado = !!usuario;
    if (usuario) {
      const base = usuario.displayName?.trim() || usuario.email?.split('@')[0] || 'Anónimo';
      this.nombreUsuario = base.charAt(0).toUpperCase() + base.slice(1);

      this.esSuperUsuario = await this.authService.esSuperUsuario();
    } else {
      this.nombreUsuario = '';
      this.esSuperUsuario = false;
    }
  });

    this.chatService.mensajesNuevos$.subscribe(count => {
      this.mensajesNuevos = count;
    });
  }

  // Determina si mostrar un ítem del menú según permisos
  mostrarItem(label: string): boolean {
    if (label === 'FACTURA' || label === 'REPORTE') {
      return this.esSuperUsuario;
    }
    return true;
  }

  // Cierra sesión del usuario y redirige al login
  async cerrar_sesion(): Promise<void> {
  try {
    await this.authService.cerrar_sesion();
    this.toast.show('Salida exitosa', 'logout');
    this.router.navigate(['/iniciar_sesion']);
  } catch (err) {
    const error = err as { error?: { mensaje?: string } };
    const mensaje = error.error?.mensaje || 'Verificá los datos.';
    this.toast.show('Error al cerrar sesión: ' + mensaje, 'error'); 
    console.error('Error al cerrar sesión:', err);
  }
}


  toggleMenuMovil(): void {
    this.menuMovilAbierto = true;
  }

  cerrarMenuMovil(): void {
    this.menuMovilAbierto = false;
  }
}