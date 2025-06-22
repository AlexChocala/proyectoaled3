import { Injectable } from '@angular/core';
import { Producto } from '../model/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor() { }

  modificar(pro: Producto){}
  agregar(pro:Producto){}
}
