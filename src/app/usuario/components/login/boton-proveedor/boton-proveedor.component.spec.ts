import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonProveedorComponent } from './boton-proveedor.component';

describe('BotonProveedorComponent', () => {
  let component: BotonProveedorComponent;
  let fixture: ComponentFixture<BotonProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonProveedorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotonProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
