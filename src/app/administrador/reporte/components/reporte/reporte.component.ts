import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../usuario/services/auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { MatDialog } from '@angular/material/dialog';
import { VentasChartComponent } from '../../shared/ventas-chart/ventas-chart.component';
import { CsvExportService } from '../../shared/csv-export.service';
import { DolarApiService } from '../../../../producto/services/dolar-api.service'; // NUEVO: para cotización
import { FirestoreService } from '../../../../services/firestore.service';
import { FacturaDialogComponent } from '../../../../carrito/factura/factura-dialog.component';


@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    VentasChartComponent
  ],
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {
  // Estado de acceso
  accesoPermitido: boolean = false;

  // Facturas
  private facturasService = new FirestoreService<any>('Facturas');
  private productosService = new FirestoreService<any>('Productos');
  private ventasService = new FirestoreService<any>('Ventas');
  public pedidos: any[] = [];
  

  // Cotización oficial del dólar
  cotizacionActual: number = 0;

  // Evolución simulada del dólar para el gráfico
  evolucionSemanal: number[] = [];
  ventasPorDia: number[] = [];
  productosMasVendidos: any[] = [];
  mostrarTodos = false;


  constructor(
    private authService: AuthService,
    private router: Router,
    private csvExportService: CsvExportService,
    private dolarApi: DolarApiService, // UEVO: para obtener cotización
    private dialog: MatDialog 
  ) { }

  /**
   * Al iniciar el componente:
   * - Verifica si el usuario es superUsuario
   * - Si no lo es, redirige o bloquea el acceso
   * - Si lo es, permite ver los reportes
   * - Obtiene cotización oficial del dólar
   * - Simula evolución semanal para el gráfico
   */
  today = new Date();

  async ngOnInit() {
    const esAdmin = await this.authService.esSuperUsuario();
    if (!esAdmin) {
      this.router.navigate(['/home']); // Redirigir si no tiene acceso
      return;
    }

    this.accesoPermitido = true;

    this.dolarApi.obtenerCotizacionOficial().subscribe(valor => {
      this.cotizacionActual = valor;
      this.generarEvolucionSemanal(valor);
    });

    // Listar facturas
    await this.facturasService.listar();

this.pedidos = this.facturasService.datos.map(f => ({
  cliente: f.email.split('@')[0],
  email: f.email,
  fecha: f.fecha.toDate().toLocaleDateString(),
  productos: (f.productos || []).map((p: any) => {
    const producto = p.producto ?? {};
    const cantidad = Number(p.cantidad ?? 0);
    const precioUnitario = Number(producto.precio ?? 0);

    return {
      producto: {
        ...producto,
        precioUnitario,
        subtotal: precioUnitario * cantidad
      },
      cantidad
    };
  }),
  totalARS: f.total,
  totalUSD: (f.total / this.cotizacionActual).toFixed(2),
  idPedido: f.id
}));

// Ordenar pedidos por fecha descendente (más reciente primero)
this.pedidos.sort((a, b) => {
  const [diaA, mesA, añoA] = a.fecha.split('/');
  const [diaB, mesB, añoB] = b.fecha.split('/');
  const fechaA = new Date(Number(añoA), Number(mesA) - 1, Number(diaA));
  const fechaB = new Date(Number(añoB), Number(mesB) - 1, Number(diaB));
  return fechaB.getTime() - fechaA.getTime();
});


    await this.procesarProductoMasVendido();
    await this.procesarVentaPorDia();

  }

  async procesarProductoMasVendido() {
    // Ventas acumuladas
    await this.ventasService.listar();

    // Agrupar por producto
    const acumulados: { [idProducto: string]: number } = {};
    this.ventasService.datos.forEach(v => {
      acumulados[v.idProducto] = (acumulados[v.idProducto] || 0) + v.totalVendido;
    });

    console.log("acumulado es ", acumulados)

    for (const [idProducto, total] of Object.entries(acumulados)) {
      const prod = await this.productosService.obtenerPorId(idProducto);
      this.productosMasVendidos.push({
        nombre: prod?.nombre || idProducto,
        total
      });
    }
    //reasigno referencia porque el hijo no se entera sino
    this.productosMasVendidos = [...this.productosMasVendidos];
    console.log("productos mas vendidos array", this.productosMasVendidos);
  }

  async procesarVentaPorDia() {
    // Listar facturas
    await this.facturasService.listar();

    // Inicializamos en 0 (Dom..Sáb por getDay)
    const ventasPorDiaRaw = Array(7).fill(0);

    // Rango de la semana actual: lunes 00:00 a domingo 23:59
    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    const dia = hoy.getDay(); // 0=Dom ... 6=Sáb
    // Ajuste para lunes como inicio: si es domingo (0), retrocedemos 6; si no, retrocedemos (dia - 1)
    const diasARetroceder = dia === 0 ? 6 : (dia - 1);
    inicioSemana.setHours(0, 0, 0, 0);
    inicioSemana.setDate(hoy.getDate() - diasARetroceder);

    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6);
    finSemana.setHours(23, 59, 59, 999);

    // Sumamos solo facturas de esta semana
    for (const f of this.facturasService.datos) {
      let fecha: Date;

      if (typeof f.fecha === 'string') {
        const [dia, mes, año] = f.fecha.split('/');
        fecha = new Date(Number(año), Number(mes) - 1, Number(dia));
      } else {
        fecha = f.fecha.toDate();
      }

      if (fecha >= inicioSemana && fecha <= finSemana) {
        const d = fecha.getDay(); // 0..6
        ventasPorDiaRaw[d] += Number(f.total) || 0;
      }
    }

    // Reordenar a labels Lunes→Domingo
    const ventasOrdenadas = [
      ventasPorDiaRaw[1], // Lunes
      ventasPorDiaRaw[2], // Martes
      ventasPorDiaRaw[3], // Miércoles
      ventasPorDiaRaw[4], // Jueves
      ventasPorDiaRaw[5], // Viernes
      ventasPorDiaRaw[6], // Sábado
      ventasPorDiaRaw[0]  // Domingo
    ];

    // Reasignar referencia para que el hijo reciba el cambio
    this.ventasPorDia = [...ventasOrdenadas];

    console.log('Ventas por día (Lun→Dom):', this.ventasPorDia);
  }


  /**
   * Simula una curva de evolución semanal del dólar
   * @param base Valor base desde la API
   */
  generarEvolucionSemanal(base: number): void {
    this.evolucionSemanal = [
      base,
      base + 1.5,
      base - 0.8,
      base + 2.2,
      base + 3.1
    ];
  }

  verFactura(idPedido: string): void {
  const pedido = this.pedidos.find(p => p.idPedido === idPedido);
  if (pedido) {
    this.dialog.open(FacturaDialogComponent, {
      data: pedido,
      width: '600px'
    });
  } else {
    console.warn('Pedido no encontrado');
  }
}


  /**
   * Exporta las facturas en formato CSV
   * (Tu compañero puede implementar la lógica real)
   */
  exportarCSV(): void {
  const encabezado = [
    'Fecha',
    'Cliente',
    'Email',
    'Producto',
    'PrecioUnitarioARS',
    'Cantidad',
    'SubtotalARS',
    'TotalARS',
    'TotalUSD'
  ];

  const filas: string[] = [];

  this.pedidos.forEach(pedido => {
    (pedido.productos || []).forEach((p: { producto: any; cantidad: number }) => {
      const producto = p.producto ?? {};
      const fila = [
        pedido.fecha,
        pedido.cliente,
        pedido.email,
        producto.nombre ?? '',
        producto.precioUnitario?.toFixed(2) ?? '',
        p.cantidad ?? '',
        producto.subtotal?.toFixed(2) ?? '',
        pedido.totalARS,
        pedido.totalUSD
      ].join(',');
      filas.push(fila);
    });
  });

  const contenido = [encabezado.join(','), ...filas].join('\n');
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'AfterStreet_Facturas.csv');
  link.click();
}

}
