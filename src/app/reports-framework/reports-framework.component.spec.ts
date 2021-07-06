import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsFrameworkComponent } from './reports-framework.component';

describe('ReportsFrameworkComponent', () => {
  let component: ReportsFrameworkComponent;
  let fixture: ComponentFixture<ReportsFrameworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsFrameworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsFrameworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
