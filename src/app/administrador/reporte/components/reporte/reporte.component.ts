import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../usuario/services/auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { VentasChartComponent } from '../../shared/ventas-chart/ventas-chart.component';
import { CsvExportService } from '../../shared/csv-export.service';
import { DolarApiService } from '../../../../producto/services/dolar-api.service'; // NUEVO: para cotización
import { FirestoreService } from '../../../../services/firestore.service';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private csvExportService: CsvExportService,
    private dolarApi: DolarApiService, // UEVO: para obtener cotización
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

    // 🔹 Listar facturas
    await this.facturasService.listar();

    this.pedidos = this.facturasService.datos.map(f => ({
      cliente: f.email.split('@')[0],
      email: f.email,
      fecha: f.fecha.toDate().toLocaleDateString(),
      productos: (f.productos || []).map((p: any) => {
        const precioUnitario = Number(p.producto?.precio ?? 0);
        const cantidad = Number(p.cantidad ?? 0);
        return {
          nombre: p.producto?.nombre || '',
          precioUnitario,
          cantidad,
          subtotal: precioUnitario * cantidad
        };
      }),
      totalARS: f.total,
      totalUSD: (f.total / this.cotizacionActual).toFixed(2),
      idPedido: f.id
    }));

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
      const fecha = f.fecha.toDate();
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

  /**
   * Exporta las facturas en formato CSV
   * (Tu compañero puede implementar la lógica real)
   */
  exportarCSV(): void {
    this.csvExportService.exportar(this.pedidos);
  }
}
