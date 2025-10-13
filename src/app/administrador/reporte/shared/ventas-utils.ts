/**
 * Funciones auxiliares para reportes de ventas.
 * Podés agregar más según lo que necesites.
 */

export function formatearFecha(fecha: Date): string {
  return fecha.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function agruparPorProducto(pedidos: any[]): Record<string, number> {
  const conteo: Record<string, number> = {};
  pedidos.forEach(p => {
    p.productos.forEach((prod: any) => {
      conteo[prod.nombre] = (conteo[prod.nombre] || 0) + prod.cantidad;
    });
  });
  return conteo;
}
