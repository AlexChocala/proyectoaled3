import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionDolarComponent } from './cotizacion-dolar.component';

describe('CotizacionDolarComponent', () => {
  let component: CotizacionDolarComponent;
  let fixture: ComponentFixture<CotizacionDolarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CotizacionDolarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CotizacionDolarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
