import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WranglingComponent } from './wrangling.component';

describe('WranglingComponent', () => {
  let component: WranglingComponent;
  let fixture: ComponentFixture<WranglingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WranglingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WranglingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
