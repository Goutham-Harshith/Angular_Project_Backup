import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LargeDataIngestionComponent } from './large-data-ingestion.component';

describe('LargeDataIngestionComponent', () => {
  let component: LargeDataIngestionComponent;
  let fixture: ComponentFixture<LargeDataIngestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LargeDataIngestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LargeDataIngestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
