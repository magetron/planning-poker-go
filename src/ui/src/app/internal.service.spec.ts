import { TestBed } from '@angular/core/testing';

import { InternalService } from './internal.service';

describe('InternalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InternalService = TestBed.get(InternalService);
    expect(service).toBeTruthy();
  });
});
