import { TestBed } from '@angular/core/testing';

import { ColaboradorCrudService } from './colaborador-crud.service';

describe('ColaboradorCrudService', () => {
  let service: ColaboradorCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColaboradorCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
