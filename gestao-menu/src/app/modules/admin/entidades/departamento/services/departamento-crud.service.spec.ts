import { TestBed } from '@angular/core/testing';

import { DepartamentoCrudService } from './departamento-crud.service';

describe('DepartamentoCrudService', () => {
  let service: DepartamentoCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartamentoCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
