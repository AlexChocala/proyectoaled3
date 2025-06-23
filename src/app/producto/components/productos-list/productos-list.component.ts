import { AfterViewInit, Component, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-productos-list',
  imports: [MatSnackBarModule, ProductoFiltrarPipe, FormsModule, MatIconModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule],
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

  constructor(private snackBar: MatSnackBar, private productoService: ProductoService, private dialog: MatDialog) {
    this.listarProductos();
  }

  editar(producto: Producto) {
    this.abrirFormulario(producto);
  }

  // TODO modificar
  eliminar(producto: Producto) {
    console.log('Eliminar', producto);
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
}
