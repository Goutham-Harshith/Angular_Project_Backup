import { TestBed } from '@angular/core/testing';

import { ScriptWriterService } from './script-writer.service';

describe('ScriptWriterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScriptWriterService = TestBed.get(ScriptWriterService);
    expect(service).toBeTruthy();
  });
});
