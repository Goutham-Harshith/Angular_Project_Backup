import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataStreamIngestionComponent } from './data-stream-ingestion.component';

describe('DataStreamIngestionComponent', () => {
  let component: DataStreamIngestionComponent;
  let fixture: ComponentFixture<DataStreamIngestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataStreamIngestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataStreamIngestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
