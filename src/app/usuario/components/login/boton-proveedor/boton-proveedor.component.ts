import { Component, input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

export type Provider = 'github' | 'google';

@Component({
  selector: 'app-boton-proveedor',
  imports: [],
  templateUrl: './boton-proveedor.component.html',
  styleUrl: './boton-proveedor.component.css'
})
export class BotonProveedorComponent {

  constructor(private router: Router, private authService: AuthService) {}

  proveedorAccion(provider: Provider): void {
    if (provider === 'google') {
      this.iniciar_sesion_google();
    } else {
      this.iniciar_sesion_github();
    }
  }

  async iniciar_sesion_google(): Promise<void> {
    return await this.authService.iniciar_sesion_google().catch((err) => {
      console.error('Error al iniciar sesión con Google:', err);
      return err;
    });
  }

  async iniciar_sesion_github(): Promise<void> {
    return await this.authService.iniciar_sesion_github().catch((err) => {
      console.error('Error al iniciar sesión con GitHub:', err);
      return err;
    });
  }
}
