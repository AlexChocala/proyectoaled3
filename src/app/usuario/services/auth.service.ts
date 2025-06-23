import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Usuario } from '../classes/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // TODO parche, separar de manera atomica
  private apiURLauth = 'http://localhost:4000/api/auth';
  private apiURLUsr = 'http://localhost:4000/api/usuarios';

  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; contrasena: string }): Observable<any> {
    return this.http.post(`${this.apiURLauth}/login`, credentials).pipe(
      tap((res: any) => localStorage.setItem(this.tokenKey, res.token))
    );
  }

  registrar(data: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiURLUsr, data);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
