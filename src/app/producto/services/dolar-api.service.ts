import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DolarApiService {
  private apiUrl = 'https://dolarapi.com/v1/dolares';

  // private http: HttpClient = inject(HttpClient);
  constructor(private http: HttpClient) { }

  obtenerCotizacionOficial(): Observable<number> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((data) => {
        const oficial = data.find((d) => d.nombre === 'Oficial');
        return oficial?.venta ?? 0;
      })
    );
  }
}
