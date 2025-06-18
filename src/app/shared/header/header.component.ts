import { Component, Inject, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { UsuarioService } from '../../pages/usuarios/usuario.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  email: string = "";
  isLoggedIn: boolean = false;
  isBrowser: boolean = false;
  private usuarioSub!: Subscription;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.usuarioSub = this.usuarioService.usuario$.subscribe(usuario => {
      if (usuario) {
        this.email = usuario.email;
        this.isLoggedIn = true;
      } else {
        this.email = "";
        this.isLoggedIn = false;
      }
    });
  }

  logout(): void {
    if (this.isBrowser) {
      this.usuarioService.setUsuario(null);
    }
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.usuarioSub) {
      this.usuarioSub.unsubscribe();
    }
  }
}