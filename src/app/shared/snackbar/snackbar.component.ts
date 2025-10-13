import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CampoValidacion } from '../campoValidacion';

@Component({
  selector: 'app-snackbar-validacion',
  imports: [CommonModule,
    MatFormFieldModule,
    MatIconModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css'
})
export class SnackbarComponent {
  @Input() control!: FormControl;
  @Input() campoNombre!: string;
  @Input() camposValidacion: CampoValidacion[] = []; // ← nuevo input dinámico

  /**
   * Devuelve el mensaje de error correspondiente para un campo específico de un formulario reactivo.
   *
   * Este método evalúa el estado de validación del control asociado al campo actual (`this.campo`)
   * dentro del `FormGroup` recibido por `@Input() form`. Utiliza reglas definidas en la constante `CAMPOS`
   * para construir mensajes personalizados según el tipo de error.
   *
   * Los errores contemplados incluyen:
   * - `required`: campo obligatorio.
   * - `minlength` / `maxlength`: longitud mínima o máxima.
   * - `pattern`: formato inválido, con mensaje personalizado si está definido.
   * - `pesoExcesivo`: validación personalizada para tamaño de imagen.
   * - `tipoInvalido`: validación personalizada para tipo de archivo.
   *
   * @returns Un mensaje de error contextual si el campo presenta errores, o `null` si está válido.
   *
   * @example
   * <mat-error *ngIf="getError()">{{ getError() }}</mat-error>
   */
  getError(): string | null {

    const c = this.control;
    const min = this.obtener(this.campoNombre, 'min');
    const max = this.obtener(this.campoNombre, 'max');
    const msj = this.obtener(this.campoNombre, 'mensaje');
    // if (!c || (!c.touched && !c.dirty)) return null;
    if (!c) return null;

    if (c.hasError('required')) return 'Campo obligatorio';
    if (c.hasError('minlength')) return `Mínimo ${min} caracteres`;
    if (c.hasError('maxlength')) return `Máximo ${max} caracteres`;
    if (c.hasError('pattern')) return msj || 'Formato inválido';
    if (c.hasError('pesoExcesivo')) return 'La imagen supera los 2MB';
    if (c.hasError('tipoInvalido')) return 'Formato no permitido (solo .jpeg, .png, .webp)';

    return null;
  }
  /**
   * Obtiene una propiedad específica de configuración para un campo definido en la constante `CAMPOS`.
   *
   * Este método permite acceder dinámicamente a valores como `min`, `max` o `mensaje` definidos
   * para cada campo en la estructura de validación, facilitando la construcción de mensajes
   * personalizados en tiempo de ejecución.
   *
   * @template T - Tipo de propiedad a obtener (clave de cada objeto en `CAMPOS`).
   * @param campo - Nombre del campo a buscar.
   * @param propiedad - Propiedad específica que se desea recuperar.
   * @returns El valor de la propiedad si existe, o `undefined` si no se encuentra.
   *
   * @example
   * const min = obtener('nombre', 'min'); // Devuelve el mínimo de caracteres para el campo 'nombre'
   */
  // private obtener<T extends keyof (typeof CAMPOS)[number]>(
  //   campo: string,
  //   propiedad: T
  // ): (typeof CAMPOS)[number][T] | undefined {
  //   return CAMPOS.find(r => r.campo === campo)?.[propiedad];
  // }
  private obtener<T extends keyof CampoValidacion>(
    campo: string,
    propiedad: T
  ): CampoValidacion[T] | undefined {
    return this.camposValidacion.find(r => r.campo === campo)?.[propiedad];
  }

}
