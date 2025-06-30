export interface Producto {
  id: number,
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: String;
  imagen: string;
  stock: number; // Agregado para manejar el stock
}
