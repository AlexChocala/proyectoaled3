import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../usuario/services/auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { trigger, transition, style, animate } from '@angular/animations';
import { CarritoService } from '../../carrito/services/carrito.service';
import { ChatService } from '../../chat/services/chat.service'; // NUEVO: para contador de mensajes

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
    private snackBar: MatSnackBar,
    public carrito: CarritoService,
    private chatService: ChatService
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
      this.snackBar.open('Salida exitosa', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/iniciar_sesion']);
    } catch (err) {
      const error = err as { error?: { mensaje?: string } };
      const mensaje = error.error?.mensaje || 'Verificá los datos.';
      alert('Error al registrar: ' + mensaje);
      this.snackBar.open('Error al registrar usuario', 'Cerrar', { duration: 3000 });
      console.error('Error al registrar usuario:', err);
    }
  }

  toggleMenuMovil(): void {
    this.menuMovilAbierto = true;
  }

  cerrarMenuMovil(): void {
    this.menuMovilAbierto = false;
  }
}