import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsProdutModalComponent } from './details-produt-modal.component';

describe('DetailsProdutModalComponent', () => {
  let component: DetailsProdutModalComponent;
  let fixture: ComponentFixture<DetailsProdutModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailsProdutModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsProdutModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
