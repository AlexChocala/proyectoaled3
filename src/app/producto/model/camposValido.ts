
// NOMBRE
export const PATRON_NOMBRE = /^[A-Za-zÁÉÍÓÚáéíóúÑñ'´\- ]+$/;
export const MIN_NOMBRE = 2;
export const MAX_NOMBRE = 50;
// DESCRIPCION
export const PATRON_DESCRIPCION = /^[\w\sáéíóúÁÉÍÓÚñÑ.,'";:()\-\[\]¡!¿?&%€$"]+$/;
export const MIN_DESCRIPCION = 10;
export const MAX_DESCRIPCION = 200;
// PRECIO
export const PATRON_PRECIO = /^\d+(\.\d{1,2})?$/;
export const MIN_PRECIO = 1;
export const MAX_PRECIO = 2;

export const CAMPOS = [
  {
    campo: 'nombre',
    min: MIN_NOMBRE,
    max: MAX_NOMBRE,
    patron: PATRON_NOMBRE,
    mensaje: "solo letras y espacios"
  },
  {
    campo: 'descripcion',
    min: MIN_DESCRIPCION,
    max: MAX_DESCRIPCION,
    patron: PATRON_DESCRIPCION,
    mensaje: "solo letras,numeros, espacios y signos comunes"
  },
  {
    campo: 'precio',
    min: MIN_PRECIO,
    max: MAX_PRECIO,
    patron: PATRON_PRECIO,
    mensaje: "solo numeros"

  },

]
