import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  mostrarPassword = false;
  mensajeError = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      contrasena: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    this.mensajeError = '';

    if (this.loginForm.valid) {
      const { email, contrasena } = this.loginForm.value;
      const datos = { email, contrasena };
      this.usuarioService.login(datos).subscribe({
        next: (res) => {
          if (res && res.success) {
            this.usuarioService.setUsuario(res.token);
            this.router.navigate(['/home']);
          } else {
            this.mensajeError = 'Email o contraseña incorrectos.';
          }
        },
        error: () => {
          this.mensajeError = 'Email o contraseña incorrectos.';
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
