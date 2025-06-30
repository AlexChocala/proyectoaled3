// NOMBRE
export const PATRON_NOMBRE = /^[A-Za-zÁÉÍÓÚáéíóúÑñ'´\- ]+$/;
export const MIN_NOMBRE = 2;
export const MAX_NOMBRE = 50;
// EMAIL
export const PATRON_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const MIN_EMAIL = 5;
export const MAX_EMAIL = 254;
// CONTRASENA
export const PATRON_CONTRASENA = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
export const MIN_CONTRASENA = 12;
export const MAX_CONTRASENA = 20;

// APELLIDO
export const PATRON_APELLIDO = /^[A-Za-zÁÉÍÓÚáéíóúÑñ'´\- ]+$/;
export const MIN_APELLIDO = 2;
export const MAX_APELLIDO = 50;

// CAMPOS
export const CAMPOS = [
  {
    campo: 'nombre',
    min: MIN_NOMBRE,
    max: MAX_NOMBRE,
    patron: PATRON_NOMBRE,
    mensaje: "solo letras y espacios"
  },
  {
    campo: 'apellido',
    min: MIN_APELLIDO,
    max: MAX_APELLIDO,
    patron: PATRON_APELLIDO,
    mensaje: "solo letras y espacios"
  },
  {
    campo: 'email',
    min: MIN_EMAIL,
    max: MAX_EMAIL,
    patron: PATRON_EMAIL,
    mensaje: "introduce email valido"
  },
  {
    campo: 'contrasena',
    min: MIN_CONTRASENA,
    max: MAX_CONTRASENA,
    patron: PATRON_CONTRASENA,
    mensaje: "min 1: letra mayuscula, miniscula, numero y caracter especial"
  },
]