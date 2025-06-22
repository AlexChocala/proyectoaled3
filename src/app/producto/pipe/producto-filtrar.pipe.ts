import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productoFiltrar'
})
export class ProductoFiltrarPipe implements PipeTransform {

 transform(lista: any[], texto: string): any[] {
    if (!texto || !lista) return lista;

    texto = texto.toLowerCase();

    return lista.filter(producto =>
      producto.nombre?.toLowerCase().includes(texto) ||
      producto.categoria?.toLowerCase().includes(texto)
    );
  }
}
