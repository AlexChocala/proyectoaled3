import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  
  private API_USUARIO = "http://localhost:4000/api/usuarios/";

  constructor(private hhtp: HttpClient) { }


  public login(){}

  public registrarse(){}
}
