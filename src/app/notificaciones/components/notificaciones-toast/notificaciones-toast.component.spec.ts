import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionesToastComponent } from './notificaciones-toast.component';

describe('NotificacionesToastComponent', () => {
  let component: NotificacionesToastComponent;
  let fixture: ComponentFixture<NotificacionesToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacionesToastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificacionesToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
