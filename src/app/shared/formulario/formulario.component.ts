import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { LucideAngularModule } from 'lucide-angular';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { CampoFormulario } from '../campoFormulario';
import { CampoValidacion } from '../campoValidacion';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
// import { CategoriaDialogComponent } from '../categoria-dialog/categoria-dialog.component';
// import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-campos-formulario',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    LucideAngularModule,
    ReactiveFormsModule,
    SnackbarComponent
  ],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
  ]
})
export class FormularioComponent {
  private dialog: MatDialog = inject(MatDialog);
  @Input() camposFormulario: CampoFormulario[] = [];
  @Input() camposValidacion: CampoValidacion[] = [];
  @Input() formulario!: FormGroup;
  hidePassword = true;

  hide() {
    return this.hidePassword;
  }

  clickEvent(event: Event) {
    event.preventDefault();
    this.hidePassword = !this.hidePassword;
  }

  getControl(nombre: string): FormControl {
    return this.formulario.get(nombre) as FormControl;
  }

  agregarCategoria() {
    const nueva = prompt('Ingrese el nombre de la nueva categoría');
    if (nueva && nueva.trim()) {
      const campo = this.camposFormulario.find(c => c.nombre === 'categoria');
      if (campo && campo.opciones && !campo.opciones.includes(nueva)) {
        campo.opciones.push(nueva.trim());
      }
    }
  }

  // async agregarCategoria() {
  //   const dialogRef = this.dialog.open(CategoriaDialogComponent, {
  //     width: '400px'
  //   });

  //   const nueva = await firstValueFrom(dialogRef.afterClosed());
  //   if (nueva) {
  //     const campo = this.camposFormulario.find(c => c.nombre === 'categoria');
  //     if (campo && campo.opciones && !campo.opciones.includes(nueva)) {
  //       campo.opciones.push(nueva);
  //     }
  //   }
  // // }

  /**
   * Capitaliza la primera letra de cada palabra en un texto.
   *
   * Útil para mostrar los títulos de los campos con formato visual más claro.
   *
   * @param texto - Cadena a transformar.
   * @returns Cadena con cada palabra capitalizada.
   */
  capitalizarLabel(texto: string): string {
    return texto
      .split(' ')
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(' ');
  }
}

/**
 * Crea dinámicamente un formulario reactivo (`FormGroup`) a partir de una lista de campos definidos por el usuario.
 *
 * Esta función permite construir formularios flexibles en tiempo de ejecución, utilizando una estructura de configuración
 * basada en la interfaz `CampoFormulario`. Cada campo puede incluir su nombre, tipo de entrada, y un conjunto de validadores.
 *
 * La función recorre la lista de campos y genera un control para cada uno, aplicando los validadores especificados.
 * Es útil para formularios dinámicos donde la estructura puede variar según el contexto o los datos recibidos.
 *
 * @param fb - Instancia de `FormBuilder` utilizada para construir el `FormGroup`.
 * @param campos - Arreglo de objetos `CampoFormulario` que definen los controles del formulario.
 * @returns Un `FormGroup` con los controles generados dinámicamente.
 *
 * @example
 * const campos: CampoFormulario[] = [
 *   { nombre: 'email', tipo: 'text', validadores: [Validators.required, Validators.email] },
 *   { nombre: 'edad', tipo: 'number', validadores: [Validators.min(18)] }
 * ];
 *
 * const formulario = generarFormulario(fb, campos);
 */
export function generarFormulario(fb: FormBuilder, campos: CampoFormulario[]): FormGroup {
  const grupo: { [key: string]: any } = {};
  for (const campo of campos) {
    grupo[campo.nombre] = fb.control('', campo.validadores || []);
  }
  return fb.group(grupo);
}
