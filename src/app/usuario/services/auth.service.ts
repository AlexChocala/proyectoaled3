import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = 'http://localhost:4000/api/auth';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiURL}/login`, credentials).pipe(
      tap((res: any) => localStorage.setItem(this.tokenKey, res.token))
    );
  }

  registrar(data: any): Observable<any> {
    return this.http.post(`${this.apiURL}/register`, data);
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
