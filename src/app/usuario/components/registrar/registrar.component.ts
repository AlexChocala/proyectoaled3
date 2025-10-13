import { Component, inject } from '@angular/core';
import { AuthService, Credencial } from '../../services/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LucideAngularModule } from 'lucide-angular';
import { BotonProveedorComponent } from '../login/boton-proveedor/boton-proveedor.component';
import { trigger, style, transition, animate } from '@angular/animations';
import { CampoFormulario } from '../../../shared/campoFormulario';
import { CampoValidacion } from '../../../shared/campoValidacion';
import { FORMULARIO_CAMPOS_USUARIO } from '../../models/formularioCamposUsuario';
import { VALIDACION_CAMPOS_USUARIO } from '../../validacion/validacionFormularioCamposUsuario';
import { FormularioComponent, generarFormulario } from '../../../shared/formulario/formulario.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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

  /* html contenido**/
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private router: Router = inject(Router);  /* datos*/

  /* datos **/
  private fb: FormBuilder = inject(FormBuilder);

  camposFormulario: CampoFormulario[] = FORMULARIO_CAMPOS_USUARIO;
  camposValidacion: CampoValidacion[] = VALIDACION_CAMPOS_USUARIO;

  formularioUsuario!: FormGroup;

  cargando = false;

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
      // 👉 Marca todos los campos como tocados para que se muestren los errores
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
    console.log("CREDENCIAL", credencial);

    try {
      await this.authService.registrarse(credencial, nombre);
      this.snackBar.open('Registro exitoso', 'Cerrar', { duration: 3000 });
      this.formularioUsuario.reset();
      this.router.navigate(['/home']);
    } catch (err) {
      alert('Error al registrar: ' + (err || 'Verificá los datos.'));
      this.snackBar.open('Error al registrar usuario', 'Cerrar', { duration: 3000 });
      console.error(err);
    } finally {
      this.cargando = false;
    }
  }

  cancelar() {
    this.formularioUsuario.reset();
  }

}
