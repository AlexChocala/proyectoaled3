import { Producto } from '../../producto/model/producto';

/**
 * Representa un ítem dentro del carrito de compras.
 * Combina un producto con la cantidad que el usuario agregó.
 * Esto permite separar los datos del producto (como stock) de los datos del carrito (como cantidad).
 */
export class ItemCarrito {
  producto: Producto;
  cantidad: number;

  constructor(producto: Producto, cantidad: number) {
    this.producto = producto;
    this.cantidad = cantidad;
  }
}
