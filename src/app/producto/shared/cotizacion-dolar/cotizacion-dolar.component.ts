import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DolarApiService } from '../../services/dolar-api.service';

@Component({
  selector: 'app-cotizacion-dolar',
  standalone: true,
  imports: [CommonModule],
  template: `<span *ngIf="cotizacion > 0">
  $ {{ (precioUSD * cotizacion).toFixed(2) }}
</span>
`,
  styleUrl: './cotizacion-dolar.component.css'
})
export class CotizacionDolarComponent implements OnInit {
  @Input() precioUSD: number = 0;
  cotizacion: number = 0;
  @Output() precioConvertido = new EventEmitter<number>();

  constructor(private dolarApi: DolarApiService) { }

  ngOnInit(): void {
    this.dolarApi.obtenerCotizacionOficial().subscribe(valor => {
      console.log('Cotización oficial:', valor);
      this.cotizacion = valor;
      this.precioConvertido.emit(this.precioUSD * valor);
    });
  }
}
