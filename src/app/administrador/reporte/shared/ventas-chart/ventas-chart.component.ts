import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-ventas-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ventas-chart.component.html'
})
export class VentasChartComponent implements OnChanges {

  @Input() evolucionSemanal: number[] = [];
  @Input() ventasPorDia: number[] = [];
  @Input() productosMasVendidos: any[] = [];

  private ventasChart?: Chart;
  private productosChart?: Chart;
  private dolarChart?: Chart;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ventasPorDia']) {
      this.renderVentasChart();
    }
    if (changes['productosMasVendidos']) {
      this.renderProductosChart();
    }
    if (changes['evolucionSemanal']) {
      this.renderDolarChart();
    }
  }

  private renderVentasChart() {
    if (this.ventasChart) this.ventasChart.destroy();
    this.ventasChart = new Chart('ventasChart', {
      type: 'bar',
      data: {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        datasets: [{
          label: 'Cantidad de ventas',
          data: this.ventasPorDia.length > 0 ? this.ventasPorDia : [12, 19, 3, 5, 8, 7, 4],
          backgroundColor: ['#A5D8FF', '#C3FBD8', '#FFD6E8', '#FFF3B0', '#D0C4FF', '#FFDAC1', '#E2F0CB'],
          borderRadius: 6
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }

  private renderProductosChart() {
    console.log("DESDE EL HIJO", this.productosMasVendidos);
    const labels = this.productosMasVendidos.map(p => p.nombre);
    const data = this.productosMasVendidos.map(p => p.total);

    if (this.productosChart) this.productosChart.destroy();
    this.productosChart = new Chart('productosChart', {
      type: 'doughnut',
      data: {
        labels,
        // labels: this.productosMasVendidos.map(p => p.nombre),
        datasets: [{
          label: 'Productos más vendidos',
          // data: this.productosMasVendidos.map(p => p.total),
          data,
          backgroundColor: ['#FFB3BA', '#BAE1FF', '#BFFCC6', '#FFFFBA', '#FFDAC1', '#E2F0CB', '#C4FAF8'],
          borderWidth: 1
        }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
  }


  private renderDolarChart() {
    if (this.dolarChart) this.dolarChart.destroy();
    this.dolarChart = new Chart('dolarChart', {
      type: 'line',
      data: {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        datasets: [{
          label: 'Cotización del dólar',
          data: this.evolucionSemanal.length > 0 ? this.evolucionSemanal : [850, 852, 849, 855, 860, 862, 858],
          borderColor: '#4F46E5',
          backgroundColor: 'rgba(79,70,229,0.1)',
          tension: 0.3,
          fill: true,
          pointRadius: 4
        }]
      },
      options: { responsive: true, plugins: { legend: { display: true } } }
    });
  }
}
