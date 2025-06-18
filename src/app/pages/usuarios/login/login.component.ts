import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../usuario.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

/*
 * Componente de login:
 * - Formulario reactivo con validaciones
 * - Simulación de login (o conexión real a API)
 * - Manejo de errores de autenticación
 */

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginError = false;
  mensajeError = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]], // Usamos 'contraseña' igual que backend
    });
  }

  onSubmit() {
    this.loginError = false;
    this.mensajeError = '';

    if (this.loginForm.valid) {
      const { email, contraseña } = this.loginForm.value;

      // Llamamos al servicio para validar usuario
      this.usuarioService.login({ email, contraseña }).subscribe({
        next: (res: any) => {
          // Corregido mensaje esperado para que coincida con el backend
          if (res && (res.mensaje === 'Inicio de sesión exitoso' || res.success)) {
            console.log('Login exitoso', res);

            // Guardar usuario usando el servicio para actualizar BehaviorSubject y localStorage
            this.usuarioService.setUsuario(res.usuario);

            // Redirigir al home sin recargar la página
            this.router.navigate(['/home']);
          } else {
            // Usuario o contraseña incorrectos
            this.loginError = true;
            this.mensajeError = 'Correo electrónico o contraseña incorrectos.';
          }
        },
        error: (err) => {
          // Error en la petición HTTP
          this.loginError = true;
          this.mensajeError = 'Correo electrónico o contraseña incorrectos.';
          console.error('Error login:', err);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
