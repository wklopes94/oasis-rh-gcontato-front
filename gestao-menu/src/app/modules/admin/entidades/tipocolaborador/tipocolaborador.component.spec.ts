import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipocolaboradorComponent } from './tipocolaborador.component';

describe('TipocolaboradorComponent', () => {
  let component: TipocolaboradorComponent;
  let fixture: ComponentFixture<TipocolaboradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipocolaboradorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipocolaboradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
