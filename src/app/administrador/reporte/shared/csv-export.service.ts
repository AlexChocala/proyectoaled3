import { Injectable } from '@angular/core';

/**
 * Servicio para exportar pedidos simulados o reales a CSV.
 * Tu compañero puede conectar esto con Firestore.
 */
@Injectable({ providedIn: 'root' })
export class CsvExportService {
  exportar(pedidos: any[]): void {
    const encabezado = ['Fecha', 'Cliente', 'Email', 'Productos', 'Total ARS', 'Total USD'];
    const filas = pedidos.map(p => {
      const productos = p.productos.map((prod: any) => `${prod.nombre} x${prod.cantidad}`).join(', ');
      return [p.fecha, p.cliente, p.email, productos, p.totalARS, p.totalUSD];
    });

    const contenido = [encabezado, ...filas]
      .map(fila => fila.map(campo => `"${campo}"`).join(','))
      .join('\n');

    const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'reportes_ventas.csv';
    link.click();
    URL.revokeObjectURL(url);
  }
}
