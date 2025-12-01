import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NotificacionesToastComponent } from './notificaciones/components/notificaciones-toast/notificaciones-toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NotificacionesToastComponent],
  template: `
    <app-header></app-header>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
    <app-notificaciones-toast></app-notificaciones-toast>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
}
