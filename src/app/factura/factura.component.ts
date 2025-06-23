import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonModule, NgClass } from '@angular/common';
import { NgFor } from '@angular/common';
import { CurrencyPipe } from '@angular/common';

export interface ProductoSeleccionado {
  nombre: string;
  cantidad: number;
  precio: number; // en ARS
}

@Component({
  selector: 'app-factura',
  imports: [NgFor, CurrencyPipe],
  templateUrl: './factura.component.html',
  styleUrl: './factura.component.css'
})
export class FacturaComponent {
  @Input() productos: ProductoSeleccionado[] = [];
  @Output() confirmarCompra = new EventEmitter<void>();

  totalARS = 0;
  totalUSD = 0;
  cotizacionDolar = 0;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.calcularTotales();
    this.obtenerTipoDeCambio();
  }

  obtenerTipoDeCambio() {
    this.http.get<any>('https://dolarapi.com/v1/dolares/oficial') // devuelve: { venta: 912, compra: 905 }
      .subscribe(data => {
        this.cotizacionDolar = data.venta;
        this.totalUSD = this.totalARS / this.cotizacionDolar;
      });
  }

  calcularTotales() {
    this.totalARS = this.productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    if (this.cotizacionDolar) {
      this.totalUSD = this.totalARS / this.cotizacionDolar;
    }
  }

  generarPDF() {
    const elemento = document.getElementById('contenedorFactura');

    html2canvas(elemento!).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
      pdf.save('factura.pdf');
    });
  }

  confirmar() {
    this.generarPDF();
    this.confirmarCompra.emit(); // Se lo comunicás al componente padre
    this.snackBar.open('✅ ¡Compra confirmada!', 'Cerrar', { duration: 3000 });
  }
}
