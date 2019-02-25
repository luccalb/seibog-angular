import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { V6Component } from './v6.component';

describe('V6Component', () => {
  let component: V6Component;
  let fixture: ComponentFixture<V6Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ V6Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(V6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
