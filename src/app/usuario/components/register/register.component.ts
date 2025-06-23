import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  formularioUsuario: FormGroup;
  mostrarPassword = false;
  mensajeExito = '';
  mensajeError = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
  ) {
    this.formularioUsuario = this.fb.group({
      //TODO testear nombre
      nombre: new FormControl('', [Validators.required]),
      //TODO testear apellido
      apellido: new FormControl('', [Validators.required]),
      //TODO testear email
      email: new FormControl('', [Validators.required, Validators.email]),
      //TODO validar contraseña valida
      contrasena: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  registrar() {
    this.mensajeExito = '';
    this.mensajeError = '';

    if (this.formularioUsuario.valid) {
      this.usuarioService.registrarUsuario(this.formularioUsuario.value).subscribe({
        next: (res) => {
          this.mensajeExito = 'Registro exitoso! ';
          this.formularioUsuario.reset();
        },
        error: (err) => {
          this.mensajeError = 'Error al registrar el usuario.';
          console.error('Error registro:', err);
        }
      });
    }
  }
}
