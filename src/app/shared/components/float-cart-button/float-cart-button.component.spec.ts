import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatCartButtonComponent } from './float-cart-button.component';

describe('FloatCartButtonComponent', () => {
  let component: FloatCartButtonComponent;
  let fixture: ComponentFixture<FloatCartButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FloatCartButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatCartButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
