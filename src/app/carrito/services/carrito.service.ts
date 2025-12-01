import { Injectable } from '@angular/core';
import { Producto } from '../../producto/model/producto';
import { ItemCarrito } from '../models/item-carrito.model';

/**
 * Servicio central del carrito.
 * Maneja toda la lógica de agregar, quitar, validar stock y calcular totales.
 * Se inyecta en cualquier componente que necesite acceder al estado del carrito.
 */
@Injectable({ providedIn: 'root' })
export class CarritoService {
  private STORAGE_KEY = 'carrito'; // NUEVO: clave para localStorage
  private items: ItemCarrito[] = []; // Privado para proteger mutabilidad

  constructor() {
    this.restaurarDesdeLocalStorage(); // NUEVO: restaurar carrito al iniciar
  }

  /**
   * Agrega un producto al carrito.
   * Si ya existe, aumenta la cantidad (hasta el límite de stock).
   * Si no existe, lo agrega con cantidad 1.
   */
  agregar(prod: Producto): boolean {
    const item = this.items.find(i => i.producto.id === prod.id);
    if (item) {
      if (item.cantidad < prod.stock) {
        item.cantidad++;
        this.guardarEnLocalStorage();
        return true;
      } else {
        alert('Ya no hay más stock disponible.');
        return false;
      }
    } else {
      this.items.push(new ItemCarrito(prod, 1));
      this.guardarEnLocalStorage();
      return true;
    }
  }

  /**
   * Agrega un producto con cantidad específica (usado para testeo o carga directa).
   */
  agregarConCantidad(prod: Producto, cantidad: number): void {
    this.items.push(new ItemCarrito(prod, cantidad));
    this.guardarEnLocalStorage(); // NUEVO: guardar después de agregar
  }

  /**
   * Resta una unidad del producto en el carrito.
   * Si la cantidad baja a 0, pregunta si se desea eliminar el producto.
   */
  restar(prod: Producto): void {
    const item = this.items.find(i => i.producto.id === prod.id);
    if (item) {
      item.cantidad--;
      if (item.cantidad < 1) {
        const confirmar = confirm('¿Desea quitar el producto del carrito?');
        if (confirmar) {
          this.eliminar(prod);
        } else {
          item.cantidad = 1;
        }
      }
      this.guardarEnLocalStorage(); // NUEVO: guardar después de restar
    }
  }

  /**
   * Elimina completamente el producto del carrito.
   */
  eliminar(prod: Producto): void {
    this.items = this.items.filter(i => i.producto.id !== prod.id);
    this.guardarEnLocalStorage(); // NUEVO: guardar después de eliminar
  }

  /**
   * Elimina un producto del carrito usando su ID directamente, con confirmación.
   */
  eliminarPorId(id: string): string {
  this.items = this.items.filter(i => i.producto.id !== id);
  this.guardarEnLocalStorage(); // Guardar después de eliminar
  return 'Producto eliminado del carrito.';
}

  /**
   * Aumenta la cantidad de un producto por ID, respetando el stock.
   */
  aumentarPorId(id: string): 'ok' | string {
    const item = this.items.find(i => i.producto.id === id);
    if (item) {
      if (item.cantidad < item.producto.stock) {
        item.cantidad++;
        this.guardarEnLocalStorage();
        return 'ok';
      } else {
        return 'No hay más stock para este producto.';
      }
    }
    return 'Producto no encontrado.';
  }

  /**
   * Disminuye la cantidad de un producto por ID.
   * Si llega a 0, pregunta si se desea eliminar.
   */
  disminuirPorId(id: string): 'ok' | 'eliminado' | null | string {
    const item = this.items.find(i => i.producto.id === id);
    if (item) {
      item.cantidad--;
      if (item.cantidad < 1) {
        const confirmar = confirm('¿Desea eliminar el producto del carrito?');
        if (confirmar) {
          this.items = this.items.filter(i => i.producto.id !== id);
          this.guardarEnLocalStorage();
          return 'eliminado';
        } else {
          item.cantidad = 1;
          return null; // No mostrar nada si cancela
        }
      } else {
        this.guardarEnLocalStorage();
        return 'ok';
      }
    }
    return 'Producto no encontrado.';
  }

  /**
   * Vacía completamente el carrito.
   */
  vaciar(): void {
    this.items.splice(0); // Vacía sin romper la referencia
    localStorage.removeItem(this.STORAGE_KEY); // Limpia el almacenamiento
  }

  /**
   * Devuelve la cantidad total de unidades en el carrito.
   */
  get cantidadTotal(): number {
    return this.items.reduce((acc, i) => acc + i.cantidad, 0);
  }

  /**
   * Devuelve el precio total acumulado del carrito.
   */
  get total(): number {
    return this.items.reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0);
  }

  /**
   * Devuelve la lista completa de ítems en el carrito.
   */
  get productos(): ItemCarrito[] {
    return this.items;
  }

  /**
   * Guarda el estado actual del carrito en localStorage.
   */
  private guardarEnLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
  }


  /**
 * Restaura el carrito desde localStorage si hay datos guardados.
 * Reconstruye correctamente los objetos Producto para evitar errores de stock.
 */
public restaurarDesdeLocalStorage(): void {
  const guardado = localStorage.getItem(this.STORAGE_KEY);
  if (guardado) {
    const restaurados = JSON.parse(guardado);
    this.items.splice(0, this.items.length);

    for (const item of restaurados) {
      // Aseguramos que el producto tenga stock y precio como número
      const producto: Producto = {
        ...item.producto,
        stock: Number(item.producto.stock),
        precio: Number(item.producto.precio),
      };
      this.items.push(new ItemCarrito(producto, item.cantidad));
    }
  }
}

}
