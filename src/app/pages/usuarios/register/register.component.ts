import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { catchError, of } from 'rxjs';
import { UsuarioService } from '../usuario.service';


/*
 * Componente de registro de usuario:
 * - Formulario reactivo con FormBuilder para validación
 * - Envío de datos a la API REST para crear usuario
 * - Manejo de mensajes de éxito y error
 */

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  formularioUsuario: FormGroup;
  mensajeExito = '';
  mensajeError = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.formularioUsuario = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]], 
    });
  }

  registrar() {
    this.mensajeExito = '';
    this.mensajeError = '';
    if (this.formularioUsuario.valid) {
      this.usuarioService.registrarUsuario(this.formularioUsuario.value)
        .pipe(
          catchError(err => {
            console.error('Error en registro:', err);
            if (err.error && err.error.mensaje) {
              this.mensajeError = err.error.mensaje;
            } else if (err.message) {
              this.mensajeError = err.message;
            } else {
              this.mensajeError = 'Error al crear la cuenta. Intenta de nuevo.';
            }
            return of(null);
          })
        )
        .subscribe((res: any) => {
          if (res) {
            this.mensajeExito = 'Cuenta creada con éxito!';
            this.formularioUsuario.reset();
          }
        });
    } else {
      this.formularioUsuario.markAllAsTouched();
    }
  }

  cancelar() {
    this.formularioUsuario.reset();
  }
}