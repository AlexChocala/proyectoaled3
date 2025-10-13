import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    RouterModule
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  // Variable que controla si se muestra el footer o no según la ruta
  mostrarFooter = true;

  constructor(private router: Router) {
    // Escuchamos los cambios de ruta (navegación)
    this.router.events.pipe(
      // Filtramos solo los eventos de tipo NavigationEnd (cuando la navegación termina)
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Ocultamos el footer si la ruta es '/iniciar_sesion' o '/registrarse'
      // En cualquier otra ruta, el footer se muestra
      const ruta = event.urlAfterRedirects;
      this.mostrarFooter = !ruta.includes('/iniciar_sesion') && !ruta.includes('/registrarse');
    });
  }
}
