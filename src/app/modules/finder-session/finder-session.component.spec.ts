/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FinderSessionComponent } from './finder-session.component';

describe('FinderSessionComponent', () => {
  let component: FinderSessionComponent;
  let fixture: ComponentFixture<FinderSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinderSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinderSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
