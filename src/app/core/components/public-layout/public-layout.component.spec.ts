import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicLaoutComponent } from './public-layout.component';

describe('PublicLaoutComponent', () => {
  let component: PublicLaoutComponent;
  let fixture: ComponentFixture<PublicLaoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicLaoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicLaoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
