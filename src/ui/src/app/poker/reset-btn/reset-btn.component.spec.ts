import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetBtnComponent } from './reset-btn.component';

describe('ResetBtnComponent', () => {
  let component: ResetBtnComponent;
  let fixture: ComponentFixture<ResetBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
