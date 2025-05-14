import { TestBed } from '@angular/core/testing';

import { PedidoAguardandoService } from './pedido-aguardando.service';

describe('PedidoAguardandoService', () => {
  let service: PedidoAguardandoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedidoAguardandoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
