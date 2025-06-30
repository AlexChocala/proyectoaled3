import { Pipe, PipeTransform } from '@angular/core';
import { Producto } from '../model/producto';

@Pipe({
  name: 'categoriaFiltrar',
  standalone: true // esto permite importarlo directamente en el componente
})
export class CategoriaFiltrarPipe implements PipeTransform {
  transform(productos: Producto[], categoria: string): Producto[] {
    if (!categoria) return productos;
    return productos.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
  }
}