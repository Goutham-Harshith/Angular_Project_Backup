import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdasComponent } from './adas.component';

describe('AdasComponent', () => {
  let component: AdasComponent;
  let fixture: ComponentFixture<AdasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
