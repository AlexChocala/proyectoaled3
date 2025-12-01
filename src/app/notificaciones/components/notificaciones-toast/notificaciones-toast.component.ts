import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionesToastService } from '../../service/notificaciones-toast.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-notificaciones-toast',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div *ngIf="toast.mensaje"
     class="fixed z-10 top-16 px-3 py-2 rounded-md border shadow flex items-center gap-2
            left-1/2 -translate-x-1/2
            sm:left-auto sm:right-10 sm:translate-x-0
            md:right-40
            lg:right-80 lg:top-33"
     [ngClass]="{
       'bg-green-50 text-green-800 border-green-200': toast.tipo === 'login' || toast.tipo === 'agregado' || toast.tipo === 'aumentado',
       'bg-blue-50 text-blue-800 border-blue-200': toast.tipo === 'modificado',
       'bg-pink-100 text-pink-700 border-pink-300': toast.tipo === 'logout' || toast.tipo === 'vaciado',
       'bg-red-100 text-red-700 border-red-300': toast.tipo === 'eliminado' || toast.tipo === 'error',
       'bg-gray-100 text-gray-700 border-gray-300': toast.tipo === 'info' || toast.tipo === 'reducida',
       'bg-yellow-100 text-yellow-800 border-yellow-300': toast.tipo === 'stock'
     }">
  <i-lucide [name]="iconForType(toast.tipo)" class="w-4 h-4"></i-lucide>
  <span class="text-sm font-medium">{{ toast.mensaje }}</span>
</div>
  `
})
export class NotificacionesToastComponent {
  constructor(public toast: NotificacionesToastService) {}

  iconForType(tipo: NotificacionesToastService['tipo']) {
  switch (tipo) {
    case 'login': return 'check-circle';
    case 'logout': return 'log-out';
    case 'agregado': return 'shopping-cart';
    case 'modificado': return 'edit';
    case 'eliminado': return 'x-circle';
    case 'vaciado': return 'trash-2';
    case 'error': return 'alert-triangle';
    case 'aumentado': return 'check-circle';
    case 'reducida': return 'minus';
    case 'stock': return 'alert-triangle';
    default: return 'info';
  }
}

}
