import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLeftContComponent } from './page-left-cont.component';

describe('PageLeftContComponent', () => {
  let component: PageLeftContComponent;
  let fixture: ComponentFixture<PageLeftContComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageLeftContComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageLeftContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
