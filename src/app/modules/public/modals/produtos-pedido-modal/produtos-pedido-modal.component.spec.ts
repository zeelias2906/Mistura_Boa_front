import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutosPedidoModalComponent } from './produtos-pedido-modal.component';

describe('ProdutosPedidoModalComponent', () => {
  let component: ProdutosPedidoModalComponent;
  let fixture: ComponentFixture<ProdutosPedidoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProdutosPedidoModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutosPedidoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
