import { Component, Inject } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LucideAngularModule } from 'lucide-angular';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-factura-dialog',
  templateUrl: './factura-dialog.component.html',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, LucideAngularModule]
})
export class FacturaDialogComponent {
  constructor(
  public dialogRef: MatDialogRef<FacturaDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any
) {}


  /**
   * Genera y descarga la factura en formato PDF
   */
  descargarFactura(): void {
    const doc = new jsPDF();

    const pedidoId = this.data.idPedido ?? 'AFS-SIN-ID';
    const fecha = this.data.fecha ?? '';

    // Encabezado
    doc.setFontSize(18);
    doc.text('After Street - Factura de compra', 20, 20);
    doc.setFontSize(12);
    doc.text(`Fecha: ${fecha}`, 20, 30);
    doc.text(`Pedido: ${pedidoId}`, 20, 37);
    doc.text(`Cliente: ${this.data.email}`, 20, 44);

    // Totales (usamos directamente lo que ya viene en data)
    doc.text(`Total ARS: ${this.data.totalARS}`, 20, 54);
    doc.text(`Total USD: ${this.data.totalUSD}`, 20, 61);

    // Detalle de productos
    doc.setFontSize(14);
    doc.text('Detalle de productos:', 20, 72);
    doc.setFontSize(11);
    doc.line(20, 74, 190, 74);

    let y = 82;
    doc.text('Producto', 20, y);
    doc.text('Cant.', 80, y);
    doc.text('ARS', 110, y);
    doc.text('Subtotal', 170, y);
    y += 6;
    doc.line(20, y, 190, y);
    y += 6;

    (this.data.productos || []).forEach((item: any) => {
  const nombre = item.producto?.nombre ?? '';
  const cantidad = item.cantidad ?? 0;
  const precioARS = item.producto?.precioUnitario ?? 0;
  const subtotalARS = item.producto?.subtotal ?? 0;

  // Convertimos todo a string seguro para jsPDF.text
  doc.text(String(nombre), 20, y);
  doc.text(String(cantidad), 80, y);
  doc.text(precioARS.toFixed(2).toString(), 110, y);
  doc.text(subtotalARS.toFixed(2).toString(), 170, y);

  y += 8;
});


    // Guardamos el PDF con nombre fijo
    doc.save('AfterStreet_Factura.pdf');
  }
  cerrarFactura(): void {
  this.dialogRef.close();
}

}
