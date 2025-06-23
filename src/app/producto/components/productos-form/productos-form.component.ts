import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CAMPOS, MAX_DESCRIPCION, MAX_NOMBRE, MIN_DESCRIPCION, MIN_NOMBRE, PATRON_DESCRIPCION, PATRON_NOMBRE, PATRON_PRECIO } from '../../model/camposValido';
import { Producto } from '../../model/producto';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductoService } from '../../services/producto.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-productos-form',
  imports: [MatSelectModule, MatIconModule, MatFormFieldModule, MatInputModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './productos-form.component.html',
  styleUrl: './productos-form.component.css'
})
export class ProductosFormComponent {

  formularioProducto: FormGroup;
  esEdicion = false;
  categoria: string[] = [];

  constructor(private dialogRef: MatDialogRef<ProductosFormComponent>, private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: { producto: Producto, categorias: string[] }, private productoService: ProductoService, private fb: FormBuilder) {
    this.formularioProducto = this.fb.group({
      nombre: new FormControl('', [Validators.required, Validators.minLength(MIN_NOMBRE), Validators.maxLength(MAX_NOMBRE), Validators.pattern(PATRON_NOMBRE)]),
      descripcion: new FormControl('', [Validators.required, Validators.minLength(MIN_DESCRIPCION), Validators.maxLength(MAX_DESCRIPCION), Validators.pattern(PATRON_DESCRIPCION)]),
      precio: new FormControl('', [Validators.required, Validators.pattern(PATRON_PRECIO)]),
      categoria: new FormControl('', [Validators.required, Validators.minLength(MIN_NOMBRE), Validators.maxLength(MAX_NOMBRE), Validators.pattern(PATRON_NOMBRE)]),
      imagen: new FormControl('', Validators.required) //TODO VALIDA
    })

  }

  // precargado de dato al iniciar
  ngOnInit(): void {
    this.categoria = this.data.categorias;
    if (this.data.producto) {
      this.esEdicion = true;
      this.formularioProducto.patchValue(this.data.producto);
    }
  }

  //bloqueado hasta que sea valido desde el html
  registrar() {
    if (this.formularioProducto.valid) {
      let prod = this.formularioProducto.value as Producto;
      if (this.esEdicion && this.data.producto?.id) {
        prod = { ...prod, id: this.data.producto.id };
      }
      const accion$ = this.productoService.guardar(prod);

      accion$.subscribe({
        next: () => {
          const msg = this.esEdicion ? 'modificado' : 'agregado';
          this.snackBar.open(`Producto ${msg} correctamente`, 'Cerrar', { duration: 3000 });
          this.dialogRef.close(prod); // o true, según necesites
        },
        error: (err) => {
          // Analiza si hay un mensaje de error personalizado en la respuesta
          const mensaje = err?.error?.message || 'Ocurrió un error inesperado.';
          this.snackBar.open(mensaje, 'Cerrar', { duration: 4000 });
          console.error(' Error del backend:', err);
        }
      });

    }
  }

  cancelar() {
    this.formularioProducto.reset(); // Limpia el formulario
    this.dialogRef.close();
  }

  getError(controlName: string): string | null {
    const c = this.formularioProducto.get(controlName);
    const min = this.obtener(controlName, 'min');
    const max = this.obtener(controlName, 'max');
    const msj = this.obtener(controlName, 'mensaje');
    if (!c) return null;

    if (c.hasError('required')) return 'Campo obligatorio';
    if (c.hasError('minlength')) return 'Mínimo ' + min + ' caracteres';
    if (c.hasError('maxlength')) return 'Máximo ' + max + ' caracteres';
    if (c.hasError('pattern')) return msj || 'Formato inválido';
    if (c.hasError('pesoExcesivo')) return 'La imagen supera los 2MB';
    if (c.hasError('tipoInvalido')) return 'Formato no permitido (solo .jpeg, .png, .webp)';

    return null;
  }

  obtener<T extends keyof (typeof CAMPOS)[number]>(
    campo: string,
    propiedad: T
  ): (typeof CAMPOS)[number][T] | undefined {
    return CAMPOS.find(r => r.campo === campo)?.[propiedad];
  }

}

