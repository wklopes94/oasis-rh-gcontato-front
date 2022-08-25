import { TestBed } from '@angular/core/testing';

import { HotelCrudService } from './hotel-crud.service';

describe('HotelCrudService', () => {
  let service: HotelCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotelCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
