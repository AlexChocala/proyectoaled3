import { Validators } from "@angular/forms";
import { CampoFormulario } from "../../shared/campoFormulario";
import { MAX_CONTRASENA, MAX_EMAIL, MIN_CONTRASENA, MIN_EMAIL, PATRON_CONTRASENA, PATRON_EMAIL } from "../validacion/validacionFormularioCamposUsuario";

export const FORMULARIO_CAMPOS_LOGIN: CampoFormulario[] = [
  {
    nombre: 'email',
    tipo: 'text',
    icono: 'mail',
    placeholder: 'nombre@gmail.com',
    validadores: [
      Validators.required,
      Validators.minLength(MIN_EMAIL),
      Validators.maxLength(MAX_EMAIL),
      Validators.pattern(PATRON_EMAIL)
    ]
  },
  {
    nombre: 'contrasena',
    tipo: 'password',
    icono: 'lock',
    placeholder: '••••••••',
    tieneToggle: true,
    validadores: [
      Validators.required,
      Validators.minLength(MIN_CONTRASENA),
      Validators.maxLength(MAX_CONTRASENA),
      Validators.pattern(PATRON_CONTRASENA)
    ]
  }
];
