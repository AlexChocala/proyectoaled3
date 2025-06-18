import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = 'http://localhost:3000/api/auth';
  private usuarioSubject = new BehaviorSubject<any>(null);
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Solo acceder a localStorage si estoy en el navegador
    if (this.isBrowser) {
      const usuarioGuardado = localStorage.getItem('usuario');
      if (usuarioGuardado) {
        this.usuarioSubject.next(JSON.parse(usuarioGuardado));
      }
    }
  }

  get usuario$() {
    return this.usuarioSubject.asObservable();
  }

  setUsuario(usuario: any) {
    if (this.isBrowser) {
      if (usuario) {
        localStorage.setItem('usuario', JSON.stringify(usuario));
        this.usuarioSubject.next(usuario);
      } else {
        localStorage.removeItem('usuario');
        this.usuarioSubject.next(null);
      }
    }
  }

  registrarUsuario(datos: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, datos);
  }

  login(datos: { email: string; contraseña: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, datos);
  }
}