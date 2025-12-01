import { Component, inject } from '@angular/core';
import { AuthService, Credencial } from '../../services/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { BotonProveedorComponent } from '../login/boton-proveedor/boton-proveedor.component';
import { trigger, style, transition, animate } from '@angular/animations';
import { CampoFormulario } from '../../../shared/campoFormulario';
import { CampoValidacion } from '../../../shared/campoValidacion';
import { FORMULARIO_CAMPOS_USUARIO } from '../../models/formularioCamposUsuario';
import { VALIDACION_CAMPOS_USUARIO } from '../../validacion/validacionFormularioCamposUsuario';
import { FormularioComponent, generarFormulario } from '../../../shared/formulario/formulario.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificacionesToastService } from '../../../notificaciones/service/notificaciones-toast.service';


@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrl: './registrar.component.css',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
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
export class RegistrarComponent {

  /** Servicios requeridos*/
  private authService: AuthService = inject(AuthService);
  private toast: NotificacionesToastService = inject(NotificacionesToastService);
  private router: Router = inject(Router); 
  private fb: FormBuilder = inject(FormBuilder);

  camposFormulario: CampoFormulario[] = FORMULARIO_CAMPOS_USUARIO;
  camposValidacion: CampoValidacion[] = VALIDACION_CAMPOS_USUARIO;

  formularioUsuario!: FormGroup;
  cargando = false;
  registradoExitoso = false;

  async ngOnInit(): Promise<void> {

    const puedeMostrar = await this.authService.hayMenosDeDosSuperUsuarios();
    this.camposFormulario = FORMULARIO_CAMPOS_USUARIO.filter(campo =>
      campo.nombre !== 'rol' || puedeMostrar
    );

    this.formularioUsuario = generarFormulario(this.fb, this.camposFormulario);
  }

  /*
  * Registra el usuario con nombre incluido
  */
  async confirmar(): Promise<void> {
  if (this.formularioUsuario.invalid) {
    Object.values(this.formularioUsuario.controls).forEach(control => control.markAsTouched());
    return;
  }

  const usrValido = this.formularioUsuario;
  const credencial: Credencial = {
    nombre: usrValido.value.nombre,
    email: usrValido.value.email,
    contrasena: usrValido.value.contrasena,
    rol: usrValido.value.rol ?? 'usuario'
  };

  this.cargando = true;
  const nombre = usrValido.value.nombre;

  try {
    await this.authService.registrarse(credencial, nombre);
    this.formularioUsuario.reset();

    setTimeout(() => {
      this.cargando = false;
      this.registradoExitoso = true;

      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 1000);
    }, 2000);
  } catch (err) {
    this.cargando = false;
    const mensaje = err || 'Verificá los datos.';
    this.toast.show('Error al registrar usuario: ' + mensaje, 'error');
    console.error(err);
  }
}



  cancelar() {
    this.formularioUsuario.reset();
  }

}
