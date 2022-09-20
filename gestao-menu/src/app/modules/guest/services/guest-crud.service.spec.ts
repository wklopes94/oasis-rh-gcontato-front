import { TestBed } from '@angular/core/testing';

import { GuestCrudService } from './guest-crud.service';

describe('GuestCrudService', () => {
  let service: GuestCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuestCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
