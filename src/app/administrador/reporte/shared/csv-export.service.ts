import { Injectable } from '@angular/core';

/**
 * Servicio para exportar pedidos simulados o reales a CSV.
 * Tu compañero puede conectar esto con Firestore.
 */
@Injectable({ providedIn: 'root' })
export class CsvExportService {

  exportar(pedidos: any[]): void {
    const encabezados = ['Fecha', 'Cliente', 'Email', 'Producto', 'PrecioUnitarioARS', 'Cantidad', 'SubtotalARS', 'TotalARS', 'TotalUSD'];
    const filas: string[][] = [];

    pedidos.forEach(p => {
      if (p.productos && p.productos.length > 0) {
        p.productos.forEach((prod: any) => {
          filas.push([
            p.fecha,
            p.cliente,
            p.email,
            prod.nombre,
            String(prod.precioUnitario),
            String(prod.cantidad),
            String(prod.subtotal),
            String(p.totalARS),
            String(p.totalUSD)
          ]);
        });
      } else {
        filas.push([
          p.fecha,
          p.cliente,
          p.email,
          '',
          '0',
          '0',
          '0',
          String(p.totalARS),
          String(p.totalUSD)
        ]);
      }
    });

    const csvContent = [
      encabezados.join(','),
      ...filas.map(f => f.map(escapeCsv).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'facturas.csv';
    link.click();
    URL.revokeObjectURL(url);

    function escapeCsv(value: any): string {
      const s = String(value ?? '');
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    }
  }
}
