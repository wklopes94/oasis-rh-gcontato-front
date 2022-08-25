import { TestBed } from '@angular/core/testing';

import { TipocolaboradorCrudService } from './tipocolaborador-crud.service';

describe('TipocolaboradorCrudService', () => {
  let service: TipocolaboradorCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipocolaboradorCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
