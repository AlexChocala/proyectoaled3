import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Producto } from '../../model/producto';
import { LucideAngularModule } from 'lucide-angular';
import { trigger, style, transition, animate } from '@angular/animations';
import { FirestoreService } from '../../../services/firestore.service';
import { FormularioComponent, generarFormulario } from '../../../shared/formulario/formulario.component';
import { CampoFormulario } from '../../../shared/campoFormulario';
import { CampoValidacion } from '../../../shared/campoValidacion';
import { VALIDACION_CAMPOS_PRODUCTO } from '../../validacion/validacionCamposProducto';
import { FORMULARIO_CAMPOS_PRODUCTO } from '../../model/formularioCamposProducto';
import { NotificacionesToastService } from '../../../notificaciones/service/notificaciones-toast.service';

@Component({
  selector: 'app-productos-form',
  standalone: true,
  imports: [FormularioComponent, CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './productos-form.component.html',
  styleUrl: './productos-form.component.css',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ProductosFormComponent {

  /* Servicio requeridos */
  // private productoService = inject(ProductoService);
  private productoService = new FirestoreService<Producto>('Productos');

  /* elementos html */
  private dialogRef = inject(MatDialogRef<ProductosFormComponent>);
  private toast = inject(NotificacionesToastService);

  /* datos */
  private fb = inject(FormBuilder);
  public data = inject(MAT_DIALOG_DATA) as { producto: Producto, categorias: string[] };

  camposFormulario: CampoFormulario[] = FORMULARIO_CAMPOS_PRODUCTO;
  camposValidacion: CampoValidacion[] = VALIDACION_CAMPOS_PRODUCTO;

  formularioProducto!: FormGroup;

  esEdicion = false;

  /**
   * Método de inicialización del componente que configura el estado del formulario dinámico.
   *
   * Este método determina si el formulario está en modo edición, actualiza dinámicamente las opciones
   * del campo `categoria`, genera el `FormGroup` correspondiente y, si aplica, precarga los datos del producto.
   *
   * Flujo de ejecución:
   * 1. Evalúa si se está editando un producto existente (`esEdicion`).
   * 2. Inyecta las opciones dinámicas en el campo `categoria` mediante `actualizarOpcionesCampo`.
   * 3. Genera el formulario reactivo a partir de la configuración de campos.
   * 4. Si es edición, precarga los valores del producto en el formulario.
   */
  ngOnInit(): void {
    this.esEdicion = !!this.data.producto; //si existe verdadero, sino false (null,undefinded)

    this.camposFormulario = this.actualizarOpcionesCampo(FORMULARIO_CAMPOS_PRODUCTO, 'categoria', this.data.categorias);
    this.formularioProducto = generarFormulario(this.fb ,this.camposFormulario);

    if (this.esEdicion) {
      this.formularioProducto.patchValue(this.data.producto);
    }
  }

  /**
   * Actualiza dinámicamente las opciones de un campo específico dentro de una lista de campos de formulario.
   *
   * Esta función es útil cuando se trabaja con formularios dinámicos y se necesita inyectar datos externos
   * (como listas de categorías, ciudades, marcas, etc.) en campos tipo `select`.
   *
   * @param campos - Lista original de campos (`CampoFormulario[]`) que definen la estructura del formulario.
   * @param nombreCampo - Nombre del campo que se desea actualizar.
   * @param nuevasOpciones - Array de opciones que se asignarán al campo.
   * @returns Una nueva lista de campos con el campo actualizado.
   *
   * @example
   * const camposActualizados = actualizarOpcionesCampo(CAMPOS_PRODUCTO, 'categoria', ['Calzado', 'Ropa', 'Accesorios']);
   */
  private actualizarOpcionesCampo(
    campos: CampoFormulario[],
    nombreCampo: string,
    nuevasOpciones: string[]
  ): CampoFormulario[] {
    return campos.map(campo =>
      campo.nombre === nombreCampo
        ? { ...campo, opciones: nuevasOpciones }
        : campo
    );
  }

  /**
   * Registra un nuevo producto o actualiza uno existente según el estado del formulario.
   *
   * Este método evalúa si el formulario es válido y determina si se trata de una operación de alta o edición.
   * En caso de edición, se conserva el `id` del producto original. Luego:
   *
   * - Si es alta, se agrega el nuevo producto a la base de datos.
   * - Si es edición, se compara el producto actual con el original para detectar cambios reales.
   *   Si no hubo modificaciones, se informa al usuario que el producto no fue alterado.
   *
   * En ambos casos, se muestra una notificación contextual mediante `mostrarToast()` y se cierra el diálogo.
   */
  async registrar() {
    this.formularioProducto.markAllAsTouched();

    if (this.formularioProducto.valid) {
      let prod = {
        ...this.formularioProducto.value,
        stock: Number(this.formularioProducto.value.stock),
        precio: Number(this.formularioProducto.value.precio)
      } as Producto;

      if (this.esEdicion && this.data.producto?.id) {
        prod = { ...prod, id: this.data.producto.id };
      }

      let msg = this.esEdicion ? 'modificado' : 'agregado';

      if (msg === 'agregado') {
        await this.productoService.agregar(prod);
        this.toast.show('Agregado correctamente', 'agregado');
        this.dialogRef.close(prod);
      } else if (msg === 'modificado') {
        const huboCambios = !this.sonIguales(this.data.producto, prod);
        await this.productoService.modificar(prod);
        const mensaje = huboCambios
          ? 'Modificado correctamente'
          : 'Producto SIN CAMBIOS';
        this.toast.show(mensaje, 'modificado');
        this.dialogRef.close(prod);
      }
    }
  }

  /**
   * Elimina el producto actual y muestra toast visual
   */
  async eliminar(): Promise<void> {
    if (this.data.producto?.id) {
      await this.productoService.eliminar(this.data.producto.id);
      this.toast.show('Eliminado correctamente', 'eliminado');
      this.dialogRef.close({ eliminado: true });
    }
  }

  /**
   * Compara dos objetos `Producto` para determinar si son idénticos en contenido.
   *
   * La comparación se realiza campo por campo utilizando `Object.keys`, evaluando que
   * cada propiedad tenga el mismo valor en ambos objetos. No se realiza comparación profunda
   * en propiedades anidadas, pero es suficiente para estructuras planas como `Producto`.
   *
   * @param a - Producto original.
   * @param b - Producto actualizado.
   * @returns `true` si todos los campos coinciden, `false` si hay al menos una diferencia.
   */
  private sonIguales(a: Producto, b: Producto): boolean {
    return Object.keys(a).every(key => a[key as keyof Producto] === b[key as keyof Producto]);
  }

  /**
   * Cancela la operación actual y cierra el diálogo.
   *
   * Este método limpia el formulario y cierra el componente modal sin guardar cambios.
   */
  cancelar() {
    this.formularioProducto.reset();
    this.dialogRef.close();
  }

}