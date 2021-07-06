import { TestBed } from '@angular/core/testing';

import { RdbmsDataIngestionService } from './rdbms-data-ingestion.service';

describe('RdbmsDataIngestionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RdbmsDataIngestionService = TestBed.get(RdbmsDataIngestionService);
    expect(service).toBeTruthy();
  });
});
