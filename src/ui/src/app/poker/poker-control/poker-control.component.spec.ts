import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PokerControlComponent } from './poker-control.component';

describe('PokerControlComponent', () => {
  let component: PokerControlComponent;
  let fixture: ComponentFixture<PokerControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PokerControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PokerControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
