import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AceitarPedidoModalComponent } from './aceitar-pedido-modal.component';

describe('AceitarPedidoModalComponent', () => {
  let component: AceitarPedidoModalComponent;
  let fixture: ComponentFixture<AceitarPedidoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AceitarPedidoModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AceitarPedidoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
