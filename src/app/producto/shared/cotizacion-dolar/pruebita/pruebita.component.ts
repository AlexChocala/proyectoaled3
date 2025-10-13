import { Component } from '@angular/core';
import { CotizacionDolarComponent } from '../cotizacion-dolar.component';

@Component({
  selector: 'app-pruebita',
  imports: [CotizacionDolarComponent],
  templateUrl: './pruebita.component.html',
  styleUrl: './pruebita.component.css'
})
export class PruebitaComponent {
  precio = 4;
}
