import { CommonModule } from '@angular/common';
import { NgModule, Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControl, FormGroup, Validator } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  imports: [MatIconModule, MatFormFieldModule, MatInputModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  formularioUsuario: FormGroup;
  mostrarPassword = false;

  constructor(private fb: FormBuilder) {
    this.formularioUsuario = this.fb.group({
      //TODO testear email
      email: new FormControl('', [Validators.required, Validators.email]),
      //TODO validar contraseña valida
      password: new FormControl('', [Validators.required]),
    })
  }

  registrar() {
    if (this.formularioUsuario.valid) {
      console.log(this.formularioUsuario.value);
    }
  }

  cancelar() {
    this.formularioUsuario.reset(); // Limpia el formulario
  }

}
