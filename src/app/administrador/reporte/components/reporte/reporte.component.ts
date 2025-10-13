import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../usuario/services/auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { VentasChartComponent } from '../../shared/ventas-chart/ventas-chart.component';
import { CsvExportService } from '../../shared/csv-export.service';
import { DolarApiService } from '../../../../producto/services/dolar-api.service'; // NUEVO: para cotización

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

  // Lista simulada de pedidos 
  pedidosMock = [
    {
      cliente: 'Alex',
      email: 'alex@email.com',
      fecha: '12/10/2025',
      totalARS: 47850,
      totalUSD: 33,
      idPedido: '#AFS-20251012-181200'
    },
    {
      cliente: 'Lucía',
      email: 'lucia@email.com',
      fecha: '11/10/2025',
      totalARS: 30500,
      totalUSD: 21,
      idPedido: '#AFS-20251011-154500'
    }
  ];

  // Cotización oficial del dólar
  cotizacionActual: number = 0;

  // Evolución simulada del dólar para el gráfico
  evolucionSemanal: number[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private csvExportService: CsvExportService,
    private dolarApi: DolarApiService // UEVO: para obtener cotización
  ) {}

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

    // TODO: Reemplazar pedidosMock por datos reales desde Firestore
    // this.pedidos = await firestoreService.listar('Pedidos');

    this.dolarApi.obtenerCotizacionOficial().subscribe(valor => {
      this.cotizacionActual = valor;
      this.generarEvolucionSemanal(valor);
    });
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
    // Simulación de pedidos con productos
    const pedidosSimulados = [
      {
        fecha: '12/10/2025',
        cliente: 'Alex',
        email: 'alex@email.com',
        productos: [
          { nombre: 'Samba', cantidad: 1 },
          { nombre: 'Essentials', cantidad: 2 }
        ],
        totalARS: 47850,
        totalUSD: 33
      },
      {
        fecha: '11/10/2025',
        cliente: 'Lucía',
        email: 'lucia@email.com',
        productos: [
          { nombre: 'Essentials', cantidad: 1 }
        ],
        totalARS: 30500,
        totalUSD: 21
      }
    ];

    this.csvExportService.exportar(pedidosSimulados);
  }
}
