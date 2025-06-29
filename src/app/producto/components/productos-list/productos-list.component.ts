import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ProductoFiltrarPipe } from '../../pipe/producto-filtrar.pipe';
import { ProductosFormComponent } from '../productos-form/productos-form.component';
import { Producto } from '../../model/producto';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProductoService } from '../../services/producto.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CarritoService } from '../../../carrito/services/carrito.service';

@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule,
    ProductoFiltrarPipe,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ],
  templateUrl: './productos-list.component.html',
  styleUrl: './productos-list.component.css'
})
export class ProductosListComponent {
  displayedColumns = ['imagen', 'nombre', 'descripcion', 'precio', 'categoria', 'accion'];
  dataSource!: MatTableDataSource<Producto>;
  busqueda: string = '';
  productoParaEditar: Producto | null = null;
  esEdicion: boolean = false;
  categoriasDisponibles!: String[];

  constructor(
    private snackBar: MatSnackBar,
    private productoService: ProductoService,
    private dialog: MatDialog,
    private carritoService: CarritoService // agregado para manejar el carrito
  ) {
    this.listarProductos();
  }

  editar(producto: Producto) {
    this.abrirFormulario(producto);
  }

  // TODO modificar
  eliminar(producto: Producto) {
    const confirmacion = confirm(`¿Estás seguro de que querés eliminar el producto "${producto.nombre}"?`);

    if (confirmacion) {
      this.productoService.eliminar(producto.id).subscribe({
        next: () => {
          this.snackBar.open('Producto eliminado correctamente', 'Cerrar', { duration: 3000 });
          this.listarProductos(); // actualiza la lista
        },
        error: (err) => {
          this.snackBar.open('Error al eliminar el producto', 'Cerrar', { duration: 3000 });
          console.error('Error eliminando producto:', err);
        }
      });
    }
  }

  agregar() {
    console.log('Agregar');
    this.abrirFormulario(null);
  }

  listarProductos(): void {
    this.productoService.listar().subscribe(productos => {
      this.dataSource = new MatTableDataSource<Producto>(productos);

      const todas = productos.map(p => p.categoria); // string[]
      this.categoriasDisponibles = [...new Set(todas)];
    });
  }

  abrirFormulario(producto: Producto | null): void {
    const dialogRef = this.dialog.open(ProductosFormComponent, {
      width: '95%',
      maxWidth: '600px',
      panelClass: 'scrolling-dialog',
      data: {
        producto,
        categorias: this.categoriasDisponibles
      }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        // Solo si se guardó (y no se canceló) lista
        this.listarProductos(); // o el método que uses para refrescar
      }
    });
  }

  // botón agrega 1 unidad del producto al carrito
  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregarProducto({
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    });

    this.snackBar.open(`${producto.nombre} agregado al carrito 🛒`, 'Cerrar', {
      duration: 2500
    });
  }

  get productosFiltrados(): Producto[] {
    return this.dataSource?.data ?? [];
  }
}
