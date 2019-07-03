import { TestBed } from '@angular/core/testing';

import { CommsService } from './comms.service';

describe('CommsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommsService = TestBed.get(CommsService);
    expect(service).toBeTruthy();
  });
});
