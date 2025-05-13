import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoRegisterComponent } from './produto-register.component';

describe('ProdutoRegisterComponent', () => {
  let component: ProdutoRegisterComponent;
  let fixture: ComponentFixture<ProdutoRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProdutoRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutoRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
