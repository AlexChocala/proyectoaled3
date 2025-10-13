import { ItemCarrito } from './item-carrito.model';
import { Producto } from '../../producto/model/producto';

describe('ItemCarrito', () => {
  it('should create an instance with minimal data', () => {
    const productoMock = {} as Producto;
    const item = new ItemCarrito(productoMock, 1);
    expect(item).toBeTruthy();
  });
});
