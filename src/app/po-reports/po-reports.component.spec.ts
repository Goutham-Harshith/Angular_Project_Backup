import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoReportsComponent } from './po-reports.component';

describe('PoReportsComponent', () => {
  let component: PoReportsComponent;
  let fixture: ComponentFixture<PoReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
