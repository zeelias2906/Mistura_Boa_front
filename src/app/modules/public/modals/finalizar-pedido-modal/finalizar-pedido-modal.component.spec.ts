import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizarPedidoModalComponent } from './finalizar-pedido-modal.component';

describe('FinalizarPedidoModalComponent', () => {
  let component: FinalizarPedidoModalComponent;
  let fixture: ComponentFixture<FinalizarPedidoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinalizarPedidoModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalizarPedidoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
