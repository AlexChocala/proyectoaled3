import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LucideAngularModule } from 'lucide-angular';
import { trigger, style, transition, animate } from '@angular/animations';
import { AuthService } from '../../../usuario/services/auth.service';
import { DolarApiService } from '../../../producto/services/dolar-api.service'; // NUEVO: para obtener cotización
import jsPDF from 'jspdf'; // NUEVO: para generar PDF
import { ItemCarrito } from '../../models/item-carrito.model'; // necesario para tipar productosConfirmados
import { FirestoreService } from '../../../services/firestore.service';
import { Producto } from '../../../producto/model/producto';

export interface Facturas {
  id?: string;
  fecha: Date;
  email: string;
  productos: ItemCarrito[];
  total: number;
}

export interface Ventas {
  id?: string;
  idProducto: string;
  totalVendido: number;
}

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    RouterModule,
    MatSnackBarModule,
    LucideAngularModule,
  ],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
  animations: [
    // Animación de entrada suave para el carrito
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class CarritoComponent implements OnInit {
  // Total acumulado en pesos argentinos
  totalARS: number = 0;

  // Total en dólares (calculado al confirmar)
  totalUSD: number = 0;

  // Cotización oficial del dólar
  cotizacion: number = 0;

  // Estado del pedido (si fue confirmado)
  pedidoConfirmado: boolean = false;

  // Mensaje de advertencia por stock limitado
  mensajeStock: string | null = null;

  // Mensaje visual tipo toast (éxito, info, etc.)
  mensajeToast: string | null = null;

  // Tipo de toast para definir color e ícono
  tipoToast: 'info' | 'stock' | 'eliminado' | 'aumentado' | 'vaciado' | 'reducida' = 'info';

  // Estado de sesión del usuario
  estaLogueado: boolean = false;

  // Nombre del usuario actual (si está logueado)
  nombreUsuario: string = '';

  // Lista de productos confirmados para la factura
  productosConfirmados: ItemCarrito[] = [];
  private productosService = new FirestoreService<Producto>('Productos');
  private facturasService = new FirestoreService<Facturas>('Facturas');
  private ventasAcumuladasService = new FirestoreService<Ventas>('Ventas');

  constructor(
    public carrito: CarritoService,
    private authService: AuthService,
    private router: Router,
    private dolarApi: DolarApiService // NUEVO: para obtener cotización
  ) { }

  /**
   * Al iniciar el componente:
   * - Restaura el carrito desde localStorage
   * - Calcula el total en ARS
   * - Obtiene cotización oficial del dólar
   * - Suscribe al estado de sesión del usuario
   */
  ngOnInit(): void {
    this.carrito.restaurarDesdeLocalStorage();
    this.calcularTotales();

    this.dolarApi.obtenerCotizacionOficial().subscribe(valor => {
      this.cotizacion = valor;
    });

    this.authService.usuario$.subscribe(usuario => {
      this.estaLogueado = !!usuario;
      this.nombreUsuario = usuario?.displayName ?? '';
    });
  }

  /**
   * Calcula el total en ARS según los productos del carrito
   */
  calcularTotales(): void {
    this.totalARS = this.carrito.total;
  }

  /**
   * Confirma el pedido actual:
   * - Guarda los productos seleccionados
   * - Calcula el total en USD
   * - Vacía el carrito
   * - Cambia el estado visual a "pedido confirmado"
   */
  async confirmarPedido(): Promise<void> {
    this.procesarFactura();
    this.totalUSD = this.cotizacion > 0 ? +(this.totalARS / this.cotizacion).toFixed(2) : 0;
    this.productosConfirmados = [...this.carrito.productos]; // Guardar productos antes de vaciar
    this.pedidoConfirmado = true;
    this.carrito.vaciar();
  }

  /**
   * Redirige al usuario a la pantalla de login
   */
  irALogin(): void {
    this.router.navigate(['/iniciar_sesion']);
  }

  /**
 * Muestra un mensaje tipo toast por 3 segundos
 * @param mensaje Texto a mostrar
 * @param tipo Tipo de mensaje para definir color e ícono
 */
  mostrarToast(mensaje: string, tipo: typeof this.tipoToast = 'info'): void {
    this.mensajeToast = mensaje;
    this.tipoToast = tipo;
    setTimeout(() => {
      this.mensajeToast = null;
    }, 3000);
  }

  /**
   * Elimina un producto del carrito por su ID
   * @param id ID del producto a eliminar
   */
  eliminarProducto(id: string): void {
    const resultado = this.carrito.eliminarPorId(id);
    if (resultado) {
      this.mostrarToast(resultado, 'eliminado');
      this.calcularTotales();
    }
  }



  /**
   * Aumenta la cantidad de un producto en el carrito
   * @param id ID del producto
   */
  aumentarCantidad(id: string): void {
    const resultado = this.carrito.aumentarPorId(id);
    if (resultado === 'ok') {
    } else {
      this.mensajeStock = resultado;
      this.mostrarToast(resultado, 'stock');
    }
    this.calcularTotales();
  }

  /**
 * Disminuye la cantidad de un producto en el carrito
 * @param id ID del producto
 */
  disminuirCantidad(id: string): void {
    const producto = this.carrito.productos.find(p => p.producto.id === id);
    if (!producto || producto.cantidad <= 1) return;

    const resultado = this.carrito.disminuirPorId(id);
    if (resultado === 'ok') {
    } else {
      this.mensajeStock = resultado;
    }
    this.calcularTotales();
  }

  /**
   * Confirma si se desea vaciar el carrito
   */
  confirmarVaciado(): void {
    const confirmacion = confirm('¿Estás seguro de que querés vaciar el carrito?');
    if (confirmacion) {
      this.vaciarCarrito();
    }
  }

  /**
   * Vacía el carrito y muestra toast
   */
  vaciarCarrito(): void {
    this.carrito.vaciar();
    this.calcularTotales();
    this.mostrarToast('Carrito vaciado', 'vaciado');
  }

  /**
   * Genera y descarga la factura en formato PDF
   */
  descargarFactura(): void {
    const doc = new jsPDF();

    // Generar número de pedido con fecha y hora
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString();
    const hora = ahora.toLocaleTimeString().replace(/:/g, '');
    const pedidoId = `#AFS-${ahora.getFullYear()}${(ahora.getMonth() + 1).toString().padStart(2, '0')}${ahora.getDate().toString().padStart(2, '0')}-${hora}`;

    // Encabezado
    doc.setFontSize(18);
    doc.text('After Street - Factura de compra', 20, 20);
    doc.setFontSize(12);
    doc.text(`Fecha: ${fecha}`, 20, 30);
    doc.text(`Pedido: ${pedidoId}`, 20, 37);
    if (this.nombreUsuario) {
      doc.text(`Cliente: ${this.nombreUsuario}`, 20, 44);
    }

    // Totales
    doc.text(`Total ARS: ${this.totalARS.toFixed(2)}`, 20, 54);
    doc.text(`Total USD: ${this.totalUSD.toFixed(2)}`, 20, 61);

    // Detalle de productos
    doc.setFontSize(14);
    doc.text('Detalle de productos:', 20, 72);
    doc.setFontSize(11);
    doc.line(20, 74, 190, 74);

    let y = 82;
    doc.text('Producto', 20, y);
    doc.text('Cant.', 80, y);
    doc.text('ARS', 110, y);
    doc.text('USD', 140, y);
    doc.text('Subtotal', 170, y);
    y += 6;
    doc.line(20, y, 190, y);
    y += 6;

    this.productosConfirmados.forEach((item) => {
      const nombre = item.producto.nombre;
      const cantidad = item.cantidad;
      const precioARS = item.producto.precio;
      const precioUSD = this.cotizacion > 0 ? +(precioARS / this.cotizacion).toFixed(2) : 0;
      const subtotalARS = precioARS * cantidad;

      doc.text(nombre, 20, y);
      doc.text(`${cantidad}`, 80, y);
      doc.text(`${precioARS.toFixed(2)}`, 110, y);
      doc.text(`${precioUSD.toFixed(2)}`, 140, y);
      doc.text(`${subtotalARS.toFixed(2)}`, 170, y);
      y += 8;
    });

    doc.save('AfterStreet_Factura.pdf');
  }


  async procesarFactura(): Promise<boolean> {
    const email = this.authService.emailActual;

    console.log("HOLA");
    if (!email) {
      this.mostrarToast('Debes iniciar sesión para confirmar el pedido.');
      return false;
    }

    const productos = this.carrito.productos; // ItemCarrito[]

    // 🔹 Convertir ItemCarrito[] a objetos planos
    const productosPlano = this.carrito.productos.map(item => ({
      cantidad: item.cantidad,
      producto: {
        id: item.producto.id,
        nombre: item.producto.nombre,
        categoria: item.producto.categoria,
        descripcion: item.producto.descripcion,
        imagen: item.producto.imagen,
        precio: item.producto.precio,
        stock: item.producto.stock
      }
    }));

    const total = this.totalARS;
    const fecha = new Date();

    const factura: Facturas = {
      email,
      fecha,
      productos: productosPlano,
      total
    };
    console.log("HOLA1");
    localStorage.getItem('carrito')

    await this.facturasService.agregar(factura);

    try {
      console.log("HOLA2");
      console.log("NOMO ", this.carrito.productos);
      console.log("Cantidad de productos:", this.carrito);
      // for (let item of this.carrito.productos) {
      for (let item of productosPlano) {
        console.log("HOLA3");

        const idProducto = item.producto.id;
        const cantidadVendida = item.cantidad;
        console.log("HOLA4");

        await this.actualizarStockProducto(idProducto, cantidadVendida);
        console.log("el id del producto es ", idProducto);
        console.log("cantidad vendida es ", cantidadVendida);
        await this.actualizarAcumuladoVenta(idProducto, cantidadVendida);
      }

      // 3. Confirmación visual
      this.mostrarToast('Pedido confirmado, ventas registradas y stock actualizado.');
      return true;
    } catch (error) {
      console.error('Error al procesar la factura:', error);
      this.mostrarToast('Ocurrió un error al procesar los datos.');
      return false;
    }
  }

  private async actualizarAcumuladoVenta(idProducto: string, cantidadVendida: number): Promise<void> {
    const ventasDeProducto = await this.ventasAcumuladasService.buscarPorCampo('idProducto', idProducto);
    if (!ventasDeProducto) { console.log("no encontrado"); }
    let acumulado: Ventas = ventasDeProducto[0];

    if (acumulado && acumulado.id) {
      // const auxacu = acumulado.totalVendido + cantidadVendida;
      // acumulado.totalVendido += auxacu;
      acumulado.totalVendido += cantidadVendida;
      console.log("VENTA ID ES ", acumulado.id);
      await this.ventasAcumuladasService.modificar(acumulado);
    } else {
       console.log("No había acumulado previo, creando nuevo registro");
      const nuevo: Ventas = {
        id: idProducto,
        idProducto,
        totalVendido: cantidadVendida
      };
      await this.ventasAcumuladasService.guardarConId(idProducto, nuevo);
    }
  }
  private async actualizarStockProducto(idProducto: string, cantidadVendida: number): Promise<void> {
    console.log("ACTUALIZAR STOCK PRODUCTO");
    console.log('ENTRANDO...', idProducto, cantidadVendida);
    const productoFirestore = await this.productosService.obtenerPorId(idProducto);
    if (!productoFirestore) {
      console.warn(`No se encontró el producto con ID: ${idProducto}`);
      return;
    }
    const prod: Producto = productoFirestore;
    const nuevoStock = Number(prod.stock) - cantidadVendida;
    if (nuevoStock < 0) {
      console.warn(`Stock negativo para el producto ${productoFirestore.nombre}`);
      return;
    }
    prod.stock = nuevoStock;
    await this.productosService.modificar(prod);
  }

}
