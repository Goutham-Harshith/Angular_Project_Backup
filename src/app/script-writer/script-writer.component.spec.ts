import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptWriterComponent } from './script-writer.component';

describe('ScriptWriterComponent', () => {
  let component: ScriptWriterComponent;
  let fixture: ComponentFixture<ScriptWriterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptWriterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptWriterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
