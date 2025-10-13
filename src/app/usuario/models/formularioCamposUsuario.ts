import { Validators } from "@angular/forms";
import { CampoFormulario } from "../../shared/campoFormulario";
import { MAX_CONTRASENA, MAX_EMAIL, MAX_NOMBRE, MIN_CONTRASENA, MIN_EMAIL, MIN_NOMBRE, PATRON_CONTRASENA, PATRON_EMAIL, PATRON_NOMBRE } from "../validacion/validacionFormularioCamposUsuario";

export const FORMULARIO_CAMPOS_USUARIO: CampoFormulario[] = [
  {
    nombre: 'nombre',
    tipo: 'text',
    icono: 'user',
    placeholder: 'ROBERTO',
    validadores: [Validators.required, Validators.minLength(MIN_NOMBRE), Validators.maxLength(MAX_NOMBRE), Validators.pattern(PATRON_NOMBRE)]
  },
  {
    nombre: 'email',
    tipo: 'text',
    icono: 'mail',
    placeholder: 'nombre@gmail.com',
    validadores: [Validators.required, Validators.minLength(MIN_EMAIL), Validators.maxLength(MAX_EMAIL), Validators.pattern(PATRON_EMAIL)]
  },
  {
    nombre: 'contrasena',
    tipo: 'password',
    icono: 'lock',
    placeholder: '••••••••',
    tieneToggle: true, // para mostrar/ocultar contraseña
    validadores: [Validators.required, Validators.minLength(MIN_CONTRASENA), Validators.maxLength(MAX_CONTRASENA), Validators.pattern(PATRON_CONTRASENA)]
  },
  {
    nombre: 'rol',
    tipo: 'radio',
    opciones: ['usuario', 'superUsuario'],
    icono: 'shield',
    validadores: [Validators.required]
  }

];
