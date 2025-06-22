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
import { productos } from '../../model/fakeDatabase';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-productos-list',
  imports: [ProductoFiltrarPipe, FormsModule, MatIconModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './productos-list.component.html',
  styleUrl: './productos-list.component.css'
})
export class ProductosListComponent {
  displayedColumns = ['imagen', 'nombre', 'descripcion', 'precio', 'categoria', 'accion'];
  dataSource;
  busqueda: string = '';
  productoParaEditar: Producto | null = null;
  esEdicion: boolean = false;

  constructor(private productoService: ProductoService, private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<Producto>(productos);
  }

  editar(producto: Producto) {
    this.abrirFormulario(producto);
    // this.productoService.geProducto(producto);
  }
  eliminar(producto: Producto) {
    console.log('Eliminar', producto);
  }

  agregar() {
    console.log('Agregar');
    this.abrirFormulario(null);
  }


  abrirFormulario(dato: Producto | null): void {
    const dialogRef = this.dialog.open(ProductosFormComponent, {
      width: '95%',
      maxWidth: '600px',
      data: dato,
      panelClass: 'scrolling-dialog'
    });
  }
}
