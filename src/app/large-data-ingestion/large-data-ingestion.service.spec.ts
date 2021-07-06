import { TestBed } from '@angular/core/testing';

import { LargeDataIngestionService } from './large-data-ingestion.service';

describe('LargeDataIngestionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LargeDataIngestionService = TestBed.get(LargeDataIngestionService);
    expect(service).toBeTruthy();
  });
});
