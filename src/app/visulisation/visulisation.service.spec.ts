import { TestBed } from '@angular/core/testing';

import { VisulisationService } from './visulisation.service';

describe('VisulisationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VisulisationService = TestBed.get(VisulisationService);
    expect(service).toBeTruthy();
  });
});
