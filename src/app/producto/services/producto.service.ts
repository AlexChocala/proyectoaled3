import { Injectable } from '@angular/core';
import { Producto } from '../model/producto';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

private readonly baseUrl = 'http://localhost:4000/api/productos';

  constructor(private http: HttpClient) { }

  // 🆕 Crear producto o //TODO modificar a futuro
  // ✏️ Modificar producto existente backend decide
  guardar(prod: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.baseUrl, prod);
  }

  // 🗑 Eliminar por ID TODO cambiar PUT por DELETE al igual que paramtros
  eliminar(id: number): Observable<void> {
    return this.http.put<void>(this.baseUrl , {id});
  }

  // 📥 Listar todos
  // listar(): Observable<Producto[]> {
    // return this.http.get<Producto[]>(this.baseUrl);
  // }
    // 📥 Listar todos (corrige acá)
  listar(): Observable<Producto[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(res => res.body) // ⬅️ Extrae solamente el array de productos
    );
  }

  // 📍 Obtener uno por ID (opcional)
  obtenerPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/${id}`);
  }

}
