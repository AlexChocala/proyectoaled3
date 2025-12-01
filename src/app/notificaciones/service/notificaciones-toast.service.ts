import { Injectable } from '@angular/core';

  // Tipos de notificación disponibles
export type TipoToast =
  | 'info'
  | 'registrado'
  | 'login'
  | 'logout'
  | 'agregado'
  | 'modificado'
  | 'eliminado'
  | 'error'
  | 'vaciado'
  | 'aumentado'
  | 'reducida' 
  | 'stock'; 

  // Hace que este servicio esté disponible en toda la app sin necesidad de declararlo en módulos.
@Injectable({ providedIn: 'root' })
export class NotificacionesToastService {
  mensaje: string | null = null;
  tipo: TipoToast = 'info';

  // Método principal: show()
  // - Recibe un mensaje y un tipo
  // - Asigna valores y los muestra
  // - Después de 3 segundos, limpia el mensaje (desaparece el toast)
  show(mensaje: string, tipo: TipoToast = 'info') {
    this.mensaje = mensaje;
    this.tipo = tipo;
    setTimeout(() => {
      this.mensaje = null;
    }, 3000);
  }
}
