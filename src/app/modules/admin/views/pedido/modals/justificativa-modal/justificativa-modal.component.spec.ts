import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JustificativaModalComponent } from './justificativa-modal.component';

describe('JustificativaModalComponent', () => {
  let component: JustificativaModalComponent;
  let fixture: ComponentFixture<JustificativaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JustificativaModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JustificativaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
