import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MpCardComponentComponent } from './mp-card-component.component';

describe('MpCardComponentComponent', () => {
  let component: MpCardComponentComponent;
  let fixture: ComponentFixture<MpCardComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MpCardComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MpCardComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
