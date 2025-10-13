import { Validators } from "@angular/forms";
import { CampoFormulario } from "../../shared/campoFormulario";
import {
  MAX_DESCRIPCION,
  MAX_NOMBRE,
  MIN_DESCRIPCION,
  MIN_NOMBRE,
  PATRON_DESCRIPCION,
  PATRON_NOMBRE,
  PATRON_PRECIO,
  PATRON_STOCK
} from "../validacion/validacionCamposProducto";

export const FORMULARIO_CAMPOS_PRODUCTO: CampoFormulario[] = [
  {
    nombre: 'nombre',
    tipo: 'text',
    icono: 'tag',
    placeholder: 'zapatilla',
    validadores: [
      Validators.required,
      Validators.minLength(MIN_NOMBRE),
      Validators.maxLength(MAX_NOMBRE),
      Validators.pattern(PATRON_NOMBRE)
    ]
  },
  {
    nombre: 'descripcion',
    tipo: 'textarea',
    icono: 'file-text',
    placeholder: 'hermosa zapa para el verano',
    validadores: [
      Validators.required,
      Validators.minLength(MIN_DESCRIPCION),
      Validators.maxLength(MAX_DESCRIPCION),
      Validators.pattern(PATRON_DESCRIPCION)
    ]
  },
  {
    nombre: 'categoria',
    tipo: 'select',
    icono: 'package',
    opciones: [], // se completa dinámicamente
    validadores: [
      Validators.required,
      Validators.minLength(MIN_NOMBRE),
      Validators.maxLength(MAX_NOMBRE),
      Validators.pattern(PATRON_NOMBRE)
    ]
  },
  {
    nombre: 'precio',
    tipo: 'number',
    icono: 'dollar-sign',
    placeholder: '99.99',
    validadores: [
      Validators.required,
      Validators.pattern(PATRON_PRECIO),
      Validators.min(0)
    ]
  },
  {
    nombre: 'stock',
    tipo: 'number',
    icono: 'shopping_bag',
    placeholder: 'Cantidad en stock',
    validadores: [
      Validators.required,
      Validators.min(0),
      Validators.pattern(PATRON_STOCK)
    ]
  },
  {
    nombre: 'imagen',
    tipo: 'url',
    icono: 'upload',
    placeholder: 'https://...',
    validadores: [Validators.required]
  }
];
