import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../usuario/services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Producto } from '../../producto/model/producto';
import { LucideAngularModule } from 'lucide-angular';
import { trigger, style, transition, animate } from '@angular/animations';
import { FirestoreService } from '../../services/firestore.service';
import { RouterModule } from '@angular/router';
import { CotizacionDolarComponent } from '../../producto/shared/cotizacion-dolar/cotizacion-dolar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CotizacionDolarComponent,CommonModule, MatSnackBarModule, LucideAngularModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class HomeComponent {
  /* Servicio requeridos */
  private productoService = new FirestoreService<Producto>('Productos');
  // elementos html

  productosRecientes: Producto[] = [];
  precioConvertidoPorId = new Map<string, number>();

  @ViewChild('slider', { static: false }) sliderRef!: ElementRef<HTMLDivElement>;
  @ViewChild('carousel', { static: false }) carouselRef!: ElementRef<HTMLDivElement>;
  currentSlide = 0;

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) { }

  async ngOnInit() {
    await this.productoService.listar();
    this.productosRecientes = [...this.productoService.datos].slice(-8).reverse();

    // Iniciar auto-slide del carrousel
    setInterval(() => this.nextSlide(), 5000);
  }

  scrollSlider(direccion: 'izquierda' | 'derecha') {
    const slider = this.sliderRef?.nativeElement;
    if (slider) {
      const desplazamiento = 320;
      slider.scrollBy({ left: direccion === 'izquierda' ? -desplazamiento : desplazamiento, behavior: 'smooth' });
    }
  }

  nextSlide() {
    const carousel = this.carouselRef?.nativeElement;
    if (carousel) {
      const totalSlides = carousel.children.length;
      this.currentSlide = (this.currentSlide + 1) % totalSlides;
      carousel.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    }
  }

  prevSlide() {
    const carousel = this.carouselRef?.nativeElement;
    if (carousel) {
      const totalSlides = carousel.children.length;
      this.currentSlide = (this.currentSlide - 1 + totalSlides) % totalSlides;
      carousel.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    }
  }

  async cerrar_sesion(): Promise<void> {
    await this.authService.cerrar_sesion().then(() => {
      this.snackBar.open('Registro exitoso', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/home']);
    }).catch((err) => {
      alert(' Error al registrar: ' + (err.error?.mensaje || 'Verificá los datos.'));
      this.snackBar.open('Error al registrar usuario', 'Cerrar', { duration: 3000 });
      console.error('Error al registrar usuario:', err);
    });
  }
}
