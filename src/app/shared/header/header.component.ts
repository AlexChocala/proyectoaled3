import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Subscription } from 'rxjs';

import { AuthService } from '../../usuario/services/auth.service';
import { CarritoService } from '../../carrito/services/carrito.service'; 
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatBadgeModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  userEmail  = '';
  private userSub = new Subscription();
  totalEnCarrito: number = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private auth: AuthService,
    private router: Router,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    // Sólo en browser, nos suscribimos al estado de usuario
    if (isPlatformBrowser(this.platformId)) {
      this.userSub = this.auth.user$.subscribe(user => {
        this.isLoggedIn = !!user;
        this.userEmail  = user?.email || '';
      });

      this.carritoService.totalProductos$.subscribe(total => {
        this.totalEnCarrito = total;
      });
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
