import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, Credencial } from '../../services/auth.service';
import {  MAX_CONTRASENA, MAX_EMAIL, MIN_CONTRASENA, MIN_EMAIL, PATRON_CONTRASENA, PATRON_EMAIL, VALIDACION_CAMPOS_USUARIO } from '../../validacion/validacionFormularioCamposUsuario';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { BotonProveedorComponent } from './boton-proveedor/boton-proveedor.component';
import { LucideAngularModule } from 'lucide-angular';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BotonProveedorComponent,
    LucideAngularModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LoginComponent {
  usuario!: FormGroup;
  verContrasena = false;
  hide = signal(true);
  isEmailFocused = false;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.usuario = this.fb.group({
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(MIN_EMAIL),
        Validators.maxLength(MAX_EMAIL),
        Validators.pattern(PATRON_EMAIL)
      ]),
      contrasena: new FormControl('', [
        Validators.required,
        Validators.minLength(MIN_CONTRASENA),
        Validators.maxLength(MAX_CONTRASENA),
        Validators.pattern(PATRON_CONTRASENA)
      ])
    });
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

    await this.authService.iniciar_sesion(credencial).then(() => {
      this.snackBar.open('Registro exitoso', 'Cerrar', { duration: 3000 });
      this.usuario.reset();
      this.router.navigate(['/home']);
    }).catch((err) => {
      alert('Error al registrar: ' + (err.error?.mensaje || 'Verificá los datos.'));
      this.snackBar.open('Error al registrar usuario', 'Cerrar', { duration: 3000 });
      console.error('Error al registrar usuario:', err);
    });
  }

  cancelar() {
    this.usuario.reset();
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  getError(controlName: string): string | null {
    const c = this.usuario?.get(controlName);
    const min = this.obtener(controlName, 'min') ?? 0;
    const max = this.obtener(controlName, 'max') ?? 999;
    const msj = this.obtener(controlName, 'mensaje') ?? '';

    if (!c || !c.touched || c.valid) return null;

    if (c.hasError('required')) return 'Campo obligatorio';
    if (c.hasError('minlength')) return `Mínimo ${min} caracteres`;
    if (c.hasError('maxlength')) return `Máximo ${max} caracteres`;
    if (c.hasError('pattern')) return msj || 'Formato inválido';

    return null;
  }

  obtener<T extends keyof (typeof VALIDACION_CAMPOS_USUARIO)[number]>(
    campo: string,
    propiedad: T
  ): (typeof VALIDACION_CAMPOS_USUARIO)[number][T] | undefined {
    return VALIDACION_CAMPOS_USUARIO.find(r => r.campo === campo)?.[propiedad];
  }
}
