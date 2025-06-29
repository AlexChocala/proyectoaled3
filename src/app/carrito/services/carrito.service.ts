import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ProductoCarrito {
  nombre: string;
  precio: number;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private productos: ProductoCarrito[] = [];
  private totalProductosSubject = new BehaviorSubject<number>(0);

  totalProductos$ = this.totalProductosSubject.asObservable();

  agregarProducto(producto: ProductoCarrito): void {
    const existente = this.productos.find(p => p.nombre === producto.nombre);

    if (existente) {
      existente.cantidad += producto.cantidad;
    } else {
      this.productos.push({ ...producto });
    }

    const total = this.productos.reduce((acc, p) => acc + p.cantidad, 0);
    this.totalProductosSubject.next(total);
  }

  obtenerProductos(): ProductoCarrito[] {
    return this.productos;
  }

  vaciarCarrito(): void {
    this.productos = [];
    this.totalProductosSubject.next(0);
  }
}