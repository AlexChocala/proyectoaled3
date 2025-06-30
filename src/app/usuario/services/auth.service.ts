import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Usuario } from '../classes/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // TODO parche, separar de manera atomica
  private apiURLauth = 'http://localhost:4000/api/auth';
  private apiURLUsr = 'http://localhost:4000/api/usuarios';
  private tokenKey = 'auth_token';
  private isBrowser: boolean;

  private _user = new BehaviorSubject<{ email: string } | null>(null);
  user$ = this._user.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const token = this.getToken();
      if (token) this.setUserFromToken(token);
    }
  }

  login(credentials: { email: string; contrasena: string }): Observable<any> {
    return this.http.post(`${this.apiURLauth}/login`, credentials).pipe(
      tap((res: any) => {
        if (!this.isBrowser) return;
        localStorage.setItem(this.tokenKey, res.token);
        this.setUserFromToken(res.token);
      })
    );
  }

  registrar(data: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiURLUsr, data);
  }

  logout(): void {
    if (this.isBrowser) localStorage.removeItem(this.tokenKey);
    this._user.next(null);
  }

  isAuthenticated(): boolean {
    return this.isBrowser && !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.tokenKey) : null;
  }

  private setUserFromToken(token: string) {
  try {
    if (!token) {
      this._user.next(null);
      return;
    }
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      this._user.next(null);
      return;
    }
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // para base64url a base64 estándar
    const payload = JSON.parse(atob(base64));
    this._user.next({ email: payload.email });
  } catch (error) {
    console.error('Error decoding token', error);
    this._user.next(null);
  }
}
  
}

