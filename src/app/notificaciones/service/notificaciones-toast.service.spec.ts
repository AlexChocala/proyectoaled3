import { TestBed } from '@angular/core/testing';

import { NotificacionesToastService } from './notificaciones-toast.service';

describe('NotificacionesToastService', () => {
  let service: NotificacionesToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificacionesToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
