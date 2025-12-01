import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService, Credencial } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { BotonProveedorComponent } from './boton-proveedor/boton-proveedor.component';
import { LucideAngularModule } from 'lucide-angular';
import { trigger, style, transition, animate } from '@angular/animations';
import { CampoFormulario } from '../../../shared/campoFormulario';
import { CampoValidacion } from '../../../shared/campoValidacion';
import { FORMULARIO_CAMPOS_LOGIN } from '../../models/formularioCamposLogin';
import { VALIDACION_CAMPOS_USUARIO } from '../../validacion/validacionFormularioCamposUsuario';
import { FormularioComponent, generarFormulario } from '../../../shared/formulario/formulario.component';
import { NotificacionesToastService } from '../../../notificaciones/service/notificaciones-toast.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [
    FormularioComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    LucideAngularModule,
    BotonProveedorComponent
  ],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
  ]
})
export class LoginComponent {

  /** Servicios requeridos */
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private fb: FormBuilder = inject(FormBuilder);
  private notificacionesToastService: NotificacionesToastService = inject(NotificacionesToastService);

  /** Campos y validaciones */
  camposFormulario: CampoFormulario[] = FORMULARIO_CAMPOS_LOGIN;
  camposValidacion: CampoValidacion[] = VALIDACION_CAMPOS_USUARIO; 
  // si querés, podés hacer un VALIDACION_CAMPOS_LOGIN

  usuario!: FormGroup;
  cargando = false;
  hide = signal(true);

  ngOnInit(): void {
    this.usuario = generarFormulario(this.fb, this.camposFormulario);
  }

  async confirmar(): Promise<void> {
    if (this.usuario.invalid) {
      Object.values(this.usuario.controls).forEach(control => control.markAsTouched());
      return;
    }

    const usrValido = this.usuario.value;
    const credencial: Credencial = {
      email: usrValido.email,
      contrasena: usrValido.contrasena
    };

    this.cargando = true;

    try {
  await this.authService.iniciar_sesion(credencial);
  this.usuario.reset();
  this.notificacionesToastService.show('Inicio de sesión exitoso', 'login');

  setTimeout(() => {
    this.router.navigate(['/home']);
  }, 1000);
} catch (err: any) {
  console.error('Error al iniciar sesión:', err);
  this.notificacionesToastService.show(
    'Error al iniciar sesión: ' + (err.error?.mensaje || 'Verificá los datos.'),
    'error'
  );
}

 finally {
      this.cargando = false;
    }
  }

  cancelar() {
    this.usuario.reset();
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

}