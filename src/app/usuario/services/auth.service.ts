import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { updateProfile } from '@angular/fire/auth';
import { Auth, AuthProvider, authState, createUserWithEmailAndPassword, GithubAuthProvider, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, User, UserCredential } from '@angular/fire/auth';
import { FirestoreService } from '../../services/firestore.service';

export interface Credencial {
  nombre?: string;
  email: string;
  contrasena: string;
  rol?: 'superUsuario' | 'usuario';
}

//EN LA TABLA
export interface Usuario {
  id?: string;
  nombre: string;
  email: string;
  rol: 'superUsuario' | 'usuario';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /* Servicio requerido */
  private usuarioService = new FirestoreService<Usuario>('Usuarios');

  readonly authState$;
  private usuarioActual = new BehaviorSubject<User | null>(null);
  usuario$ = this.usuarioActual.asObservable();

  constructor(private auth: Auth) {
    this.authState$ = authState(this.auth);
    onAuthStateChanged(auth, (user) => {
      this.usuarioActual.next(user);
    });
  }

  /*
    * crea usuario en tu cuenta firebase mediante email y contrasena
    * solicitando la credencial de contrasena y email
    */
  async registrarse(credencial: Credencial, nombre: string): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, credencial.email, credencial.contrasena);
    const uid = userCredential.user.uid;
    // Construir objeto Usuario compatible
    const usuario: Usuario = {
      nombre,
      email: credencial.email,
      rol: credencial.rol ?? 'usuario' // valor por defecto si no se especifica
    };

    await this.usuarioService.guardarConId(uid, usuario);

    await updateProfile(userCredential.user, {
      displayName: nombre
    });
    return userCredential;
  }

  async guardarUsuarioSiNoExiste(credencial: UserCredential): Promise<void> {
    const user = credencial.user;
    const uid = user.uid;
    const nombre = user.displayName ?? 'Sin nombre';
    const email = user.email ?? '';
    const existente = await this.usuarioService.obtenerPorId(uid);

    const usuario: Usuario = {
      nombre,
      email: email,
      rol: 'usuario' // valor por defecto
    };
    if (!existente) {
      await this.usuarioService.guardarConId(uid, usuario);
    }
  }

  /*
  * inicia sesion email(generico) de firebase
  */
  iniciar_sesion(credencial: Credencial): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, credencial.email, credencial.contrasena);
  }

  /* Proveedor: Google
  * inicia sesion mediante google
  */
  async iniciar_sesion_google(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    const credencial = await this.abrirVentana(provider);
    await this.guardarUsuarioSiNoExiste(credencial);
    return credencial;
  }

  /* Proveedor: Github
  * inicia sesion mediante google
  */
  async iniciar_sesion_github(): Promise<UserCredential> {
    const provider = new GithubAuthProvider();
    const credencial = await this.abrirVentana(provider);
    await this.guardarUsuarioSiNoExiste(credencial);
    return credencial;
  }

  /**
  * Abre ventana emegente para googel
  */
  async abrirVentana(provider: AuthProvider): Promise<UserCredential> {
    try {
      const credencial = await signInWithPopup(this.auth, provider);
      return credencial;
    } catch (err) {
      console.error('Error al iniciar sesión con proveedor:', err);
      throw err;
    }
  }

  /*
  * cierra sesion de firebase
  */
  cerrar_sesion(): Promise<void> {
    return this.auth.signOut();
  }

  /* Bloquear componente
  * Verifica que este logueado
  *
  */
  estaLogueado(): boolean {
    return this.usuarioActual.value !== null;
  }

  async esSuperUsuario(): Promise<boolean> {
    const uid = this.uid;
    if (!uid) return false;

    const usuario = await this.usuarioService.obtenerPorId(uid);
    return usuario?.rol === 'superUsuario';
  }

  //TODO OBTENER EL ID del USUARIO en la actual sesion
  get uid(): string | null {
    return this.auth.currentUser?.uid ?? null;
  }

  // ✅ NUEVO: obtener el email del usuario actual
  get emailActual(): string {
    return this.usuarioActual.value?.email ?? '';
  }

  async hayMenosDeDosSuperUsuarios(): Promise<boolean> {
    await this.usuarioService.listar(); // carga todos los usuarios
    const cantidad = this.usuarioService.datos.filter(u => u.rol === 'superUsuario').length;
    return cantidad < 2;
  }

}
