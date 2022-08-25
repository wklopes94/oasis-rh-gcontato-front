import { TestBed } from '@angular/core/testing';

import { ExtensaoCrudService } from './extensao-crud.service';

describe('ExtensaoCrudService', () => {
  let service: ExtensaoCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtensaoCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
