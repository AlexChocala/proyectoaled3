import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { CAMPOS, MAX_CONTRASENA, MAX_EMAIL, MIN_CONTRASENA, MIN_EMAIL, PATRON_CONTRASENA, PATRON_EMAIL } from '../field';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [MatIconModule, MatFormFieldModule, MatInputModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  formularioLogin: FormGroup;
  verContrasena = false;

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {
    this.formularioLogin = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.minLength(MIN_EMAIL), Validators.maxLength(MAX_EMAIL), Validators.pattern(PATRON_EMAIL)]),
      contrasena: new FormControl('', [Validators.required, Validators.minLength(MIN_CONTRASENA), Validators.maxLength(MAX_CONTRASENA), Validators.pattern(PATRON_CONTRASENA)]),
    })
  }

  confirmar() {
    if (this.formularioLogin.valid) {
      let value = this.formularioLogin.value;

      // modifiqué esto para que email y contraseña se limpien de espacios y comillas dobles al inicio y final
      value.email = value.email.trim();
      value.contrasena = value.contrasena.trim().replace(/^"+|"+$/g, '');

      console.log(value);

      // agregué esto para que se haga el login real al backend
      this.authService.login(value).subscribe({
        next: (res) => {
          console.log('Login exitoso:', res);
          // agregué esto para redirigir al home al iniciar sesión
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Error en login:', err);
          alert('Error al iniciar sesión. Verificá tus credenciales.');
        }
      });
    }
  }

  cancelar() {
    this.formularioLogin.reset();
  }

  // ocultar contraseña
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  irARegistro() {
    this.router.navigate(['/registrar']);
  }

  getError(controlName: string): string | null {
    const c = this.formularioLogin.get(controlName);
    const min = this.obtener(controlName, 'min');
    const max = this.obtener(controlName, 'max');
    const msj = this.obtener(controlName, 'mensaje');
    if (!c) return null;

    if (c.hasError('required')) return 'Campo obligatorio';
    if (c.hasError('minlength')) return 'Mínimo ' + min + ' caracteres';
    if (c.hasError('maxlength')) return 'Máximo ' + max + ' caracteres';
    if (c.hasError('pattern')) return msj || 'Formato inválido';

    return null;
  }

  obtener<T extends keyof (typeof CAMPOS)[number]>(
    campo: string,
    propiedad: T
  ): (typeof CAMPOS)[number][T] | undefined {
    return CAMPOS.find(r => r.campo === campo)?.[propiedad];
  }
}


