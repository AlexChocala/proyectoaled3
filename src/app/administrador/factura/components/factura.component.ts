import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CurrencyPipe, NgFor, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface ProductoSeleccionado {
  nombre: string;
  cantidad: number;
  precio: number;
}

@Component({
  selector: 'app-factura',
  standalone: true,
  imports: [MatIconModule ,CommonModule, NgFor, CurrencyPipe],
  templateUrl: './factura.component.html',
  styleUrl: './factura.component.css'
})
export class FacturaComponent {
  @Input() productos: ProductoSeleccionado[] = [];
  @Output() confirmarCompra = new EventEmitter<void>();

  totalARS = 0;
  totalUSD = 0;
  cotizacionDolar = 0;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.calcularTotales();
    this.obtenerCotizacionBCRA();
  }

  calcularTotales(): void {
    this.totalARS = this.productos.reduce(
      (acc, p) => acc + p.precio * p.cantidad,
      0
    );
    if (this.cotizacionDolar) {
      this.totalUSD = this.totalARS / this.cotizacionDolar;
    }
  }

  obtenerCotizacionBCRA(): void {
    const headers = new HttpHeaders({
      Authorization: 'BEARER TU_TOKEN_AQUI' // ← reemplazá por tu token del BCRA
    });

    this.http
      .get<any[]>('https://api.estadisticasbcra.com/usd_of', { headers })
      .subscribe({
        next: (data) => {
          const ultimo = data[data.length - 1];
          this.cotizacionDolar = ultimo.v;
          this.totalUSD = this.totalARS / this.cotizacionDolar;
        },
        error: (err) => {
          this.snackBar.open('No se pudo obtener el dólar oficial 💸', 'Cerrar', {
            duration: 3000
          });
          console.error('Error BCRA:', err);
        }
      });
  }

  generarPDF(): void {
    const elemento = document.getElementById('contenedorFactura');
    if (!elemento) return;

    html2canvas(elemento).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 10, 10, pageWidth - 20, pdfHeight);
      pdf.save('factura.pdf');
    });
  }

  confirmar(): void {
    this.generarPDF();
    this.confirmarCompra.emit();
    this.snackBar.open('✅ ¡Compra confirmada!', 'Cerrar', { duration: 3000 });
  }
}
