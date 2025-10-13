import { Component, AfterViewInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-ventas-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ventas-chart.component.html'
})
export class VentasChartComponent implements AfterViewInit {
  // 🧩 Recibe evolución semanal del dólar desde el componente padre
  @Input() evolucionSemanal: number[] = [];

  /**
   * Al renderizar el componente, se generan los tres gráficos con datos simulados.
   * El gráfico de dólar usa los datos reales pasados por @Input().
   */
  ngAfterViewInit(): void {
    // 📊 Ventas por día
    new Chart('ventasChart', {
      type: 'bar',
      data: {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
        datasets: [{
          label: 'Cantidad de ventas',
          data: [12, 19, 3, 5, 8],
          backgroundColor: ['#A5D8FF', '#C3FBD8', '#FFD6E8', '#FFF3B0', '#D0C4FF'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 5 }
          }
        }
      }
    });

    // 🛍️ Productos más vendidos
    new Chart('productosChart', {
      type: 'doughnut',
      data: {
        labels: ['Remera Essentials', 'Jordan Retro', 'Buzo Fire', 'Samba Adidas'],
        datasets: [{
          label: 'Productos más vendidos',
          data: [25, 18, 12, 30],
          backgroundColor: ['#FFB3BA', '#BAE1FF', '#BFFCC6', '#FFFFBA'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });

    // 💱 Evolución del dólar (usa datos reales si están disponibles)
    new Chart('dolarChart', {
      type: 'line',
      data: {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
        datasets: [{
          label: 'Cotización del dólar',
          data: this.evolucionSemanal.length > 0 ? this.evolucionSemanal : [850, 852, 849, 855, 860],
          borderColor: '#4F46E5',
          backgroundColor: 'rgba(79,70,229,0.1)',
          tension: 0.3,
          fill: true,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        },
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
  }
}
