import { TestBed } from '@angular/core/testing';

import { DolarApiService } from './dolar-api.service';

describe('DolarApiService', () => {
  let service: DolarApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DolarApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
