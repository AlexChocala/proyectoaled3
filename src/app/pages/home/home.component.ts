import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section style="text-align:center; padding: 2rem;">
      <h1>Bienvenido</h1>
      <p>Iniciaste sesión correctamente.</p>
    </section>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}