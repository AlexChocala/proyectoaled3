import { Component, inject } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ProductoFiltrarPipe } from '../../pipe/producto-filtrar.pipe';
import { ProductosFormComponent } from '../productos-form/productos-form.component';
import { Producto } from '../../model/producto';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../usuario/services/auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { trigger, style, transition, animate } from '@angular/animations';
import { FirestoreService } from '../../../services/firestore.service';
import { MatdialogComponent } from '../../../shared/matdialog/matdialog.component';
import { CarritoService } from '../../../carrito/services/carrito.service';
import { CommonModule } from '@angular/common';
import { CotizacionDolarComponent } from '../../shared/cotizacion-dolar/cotizacion-dolar.component';

export const columna = [
  { key: 'nombre', label: 'NOMBRE', icon: 'label' },
  { key: 'descripcion', label: 'DESCRIPCIÓN', icon: 'notes' },
  { key: 'precio', label: 'PRECIO', icon: 'attach_money' },
  { key: 'categoria', label: 'CATEGORÍA', icon: 'category' },
  { key: 'imagen', label: 'IMAGEN', icon: 'image' }
];

@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [
    CotizacionDolarComponent,
    CommonModule,
    MatSnackBarModule,
    ProductoFiltrarPipe,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    LucideAngularModule
  ],
  templateUrl: './productos-list.component.html',
  styleUrl: './productos-list.component.css',
  animations: [
    // Animación de entrada suave al cargar la vista
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    // Animación suave para cada tarjeta de producto (sin escalonado)
    trigger('cardFadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class ProductosListComponent {
  /* Servicios requeridos */
  private authService: AuthService = inject(AuthService);
  private productoService = new FirestoreService<Producto>('Productos');
  private dialog: MatDialog = inject(MatDialog);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private carrito = inject(CarritoService);

  // Columnas visibles en la tabla
  public columnas = columna;
  public displayedColumnas = [...this.columnas.map(c => c.key), 'accion'];

  // Datos y estado de la vista
  dataSource!: MatTableDataSource<Producto>;
  busqueda: string = '';
  productoParaEditar: Producto | null = null;
  esEdicion: boolean = false;
  logueado: boolean = false;
  esSuperusuario: boolean = false;

  categoriasDisponibles!: { nombre: string; cantidad: number }[];
  categoriaSeleccionada: string | null = null;

  precioConvertidoPorId = new Map<string, number>();

  /**
   * Mensaje visual tipo toast (éxito, info, etc.)
   */
  mensajeToast: string | null = null;

  /**
   * Tipo de toast para definir color e ícono
   */
  tipoToast: 'agregado' | 'modificado' | 'eliminado' = 'agregado';

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   *
   * Invoca el método `leer()` para cargar los datos de productos desde el servicio
   * y preparar la tabla con la información actual.
   * También detecta si el usuario está logueado y si tiene rol de superUsuario.
   */
  async ngOnInit() {
    await this.leer();

    // Detecta si el usuario está logueado
    this.authService.usuario$.subscribe(usuario => {
      this.logueado = !!usuario;
    });

    // NUEVO: Verifica si el usuario actual es superUsuario
    this.esSuperusuario = await this.authService.esSuperUsuario();
  }

  /**
   * Inicia el proceso de edición de un producto existente.
   *
   * Abre el formulario de edición en un diálogo modal, pasando el producto seleccionado
   * como parámetro para su edición.
   *
   * @param producto - El producto que se desea editar.
   */
  editar(producto: Producto) {
    this.abrirFormulario(producto);
  }

  /**
   * Método para seleccionar o deseleccionar una categoría.
   *
   * Si el usuario hace clic en una categoría ya seleccionada, se desactiva el filtro.
   * Si selecciona una nueva, se actualiza el filtro de búsqueda con esa categoría.
   *
   * @param nombre - Nombre de la categoría seleccionada.
   */
  seleccionarCategoria(nombre: string) {
    if (this.categoriaSeleccionada === nombre) {
      this.categoriaSeleccionada = null;
      this.busqueda = '';
    } else {
      this.categoriaSeleccionada = nombre;
      this.busqueda = nombre;
    }
  }

  /**
   * Solicita confirmación al usuario para eliminar un producto y ejecuta la eliminación si se aprueba.
   *
   * Abre un diálogo de confirmación (`MatdialogComponent`) y espera la respuesta del usuario.
   * Si el usuario confirma, se elimina el producto desde el servicio y se actualiza la tabla.
   * Se muestra una notificación contextual mediante `MatSnackBar`.
   *
   * @param producto - El producto que se desea eliminar.
   */
  async eliminar(producto: Producto) {
    this.dialog.open(MatdialogComponent).afterClosed().subscribe(async confirmacion => {
      if (confirmacion) {
        await this.productoService.eliminar(producto.id);
        await this.leer();
        this.mostrarToast('Producto eliminado correctamente', 'eliminado');
      }
    });
  }

  /**
   * Inicia el proceso de creación de un nuevo producto.
   *
   * Abre el formulario en modo de alta, sin pasar ningún producto como parámetro.
   */
  agregar() {
    this.abrirFormulario(null);
  }

  /**
   * Agrega un producto al carrito, usando el precio convertido si está disponible.
   *
   * Muestra una notificación de confirmación al usuario.
   *
   * @param producto - El producto que se desea agregar al carrito.
   */
  agregarAlCarrito(producto: Producto): void {
    const precioConvertido = this.precioConvertidoPorId.get(producto.id);
    const precioFinal = precioConvertido ?? producto.precio;

    const productoConPrecioFinal = {
      ...producto,
      precio: +(precioFinal).toFixed(2)
    };

    const agregado = this.carrito.agregar(productoConPrecioFinal);
    if (agregado) {
      this.mostrarToast('Producto agregado al carrito', 'agregado');
    }
  }

  /**
   * Carga los productos desde Firestore y actualiza la tabla.
   *
   * También agrupa los productos por categoría y cuenta cuántos hay por cada una.
   */
  async leer() {
    await this.productoService.listar();
    this.dataSource = new MatTableDataSource<Producto>(this.productoService.datos);
    this.dataSource.data = [...this.productoService.datos]; // TODO: parche para el correcto refresco

    const conteoCategorias: { [key: string]: number } = {};
    this.dataSource.data.forEach(p => {
      conteoCategorias[p.categoria] = (conteoCategorias[p.categoria] || 0) + 1;
    });

    this.categoriasDisponibles = Object.entries(conteoCategorias).map(([nombre, cantidad]) => ({
      nombre,
      cantidad
    }));

    // Ordenar por cantidad descendente
    this.categoriasDisponibles.sort((a, b) => b.cantidad - a.cantidad);

    console.log('Datos en tabla:', this.dataSource.data);
  }

  /**
   * Abre el formulario de producto en un diálogo modal.
   *
   * Si se pasa un producto, se abre en modo edición.
   * Si no, se abre en modo creación.
   *
   * @param producto - El producto a editar, o null para crear uno nuevo.
   */
  abrirFormulario(producto: Producto | null) {
    const dialogRef = this.dialog.open(ProductosFormComponent, {
      width: '95%',
      maxWidth: '600px',
      panelClass: 'scrolling-dialog',
      data: {
        producto,
        categorias: this.categoriasDisponibles.map(c => c.nombre)
      }
    });

    dialogRef.afterClosed().subscribe(async resultado => {
      if (resultado?.eliminado) {
        this.mostrarToast('Producto eliminado correctamente', 'eliminado');
        await this.leer();
      } else if (resultado) {
        await this.leer();
      }
    });
  }

  /**
   * Muestra un mensaje tipo toast por 3 segundos
   * @param mensaje Texto a mostrar
   * @param tipo Tipo de mensaje para definir color e ícono
   */
  mostrarToast(mensaje: string, tipo: typeof this.tipoToast = 'agregado'): void {
    this.mensajeToast = mensaje;
    this.tipoToast = tipo;
    setTimeout(() => {
      this.mensajeToast = null;
    }, 3000);
  }
}
