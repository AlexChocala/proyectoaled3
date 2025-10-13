import { ValidatorFn } from "@angular/forms";

export interface CampoFormulario {
  nombre: string;
  icono?: string;
  tipo: 'text' | 'number' | 'url' | 'select' | 'textarea' | 'password' | 'radio';
  placeholder?: string;
  opciones?: string[]; //para el select categoria
  tieneToggle?: boolean;
  prefix?: string;
  validadores?: ValidatorFn[];
}
