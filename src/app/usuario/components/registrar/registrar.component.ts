import { Component, signal } from '@angular/core';
import { CAMPOS, MAX_CONTRASENA, MAX_EMAIL, MAX_NOMBRE, MIN_CONTRASENA, MIN_EMAIL, MIN_NOMBRE, PATRON_CONTRASENA, PATRON_EMAIL, PATRON_NOMBRE } from '../field';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  imports: [MatIconModule, MatFormFieldModule, MatInputModule, CommonModule, FormsModule, ReactiveFormsModule],
  styleUrl: './registrar.component.css'
})
export class RegistrarComponent {
  formularioLogin: FormGroup;
  verContrasena = false;

  constructor(private router: Router, private snackBar: MatSnackBar ,private authService: AuthService, private fb: FormBuilder) {
    this.formularioLogin = this.fb.group({
      nombre: new FormControl('', [Validators.required, Validators.minLength(MIN_NOMBRE), Validators.maxLength(MAX_NOMBRE), Validators.pattern(PATRON_NOMBRE)]),
      email: new FormControl('', [Validators.required, Validators.minLength(MIN_EMAIL), Validators.maxLength(MAX_EMAIL), Validators.pattern(PATRON_EMAIL)]),
      contrasena: new FormControl('', [Validators.required, Validators.minLength(MIN_CONTRASENA), Validators.maxLength(MAX_CONTRASENA), Validators.pattern(PATRON_CONTRASENA)]),
    })
  }

  confirmar() {
    if (this.formularioLogin.valid) {
      const usuario = this.formularioLogin.value;
      this.authService.registrar(usuario).subscribe({
        next: () => {
          this.snackBar.open('Registro exitoso', 'Cerrar', { duration: 3000 });
          this.formularioLogin.reset();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          alert(' Error al registrar: ' + (err.error?.mensaje || 'Verificá los datos.'));
          this.snackBar.open('Error al registrar usuario', 'Cerrar', { duration: 3000 });
          console.error('Error al registrar usuario:', err);

        }
      });
    }

  }


  cancelar() {
    this.formularioLogin.reset;
  }

  // ocultar contraseña
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
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
