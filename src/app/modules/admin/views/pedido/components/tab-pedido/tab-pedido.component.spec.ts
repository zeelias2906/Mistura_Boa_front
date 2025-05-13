import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabPedidoComponent } from './tab-pedido.component';

describe('TabPedidoComponent', () => {
  let component: TabPedidoComponent;
  let fixture: ComponentFixture<TabPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabPedidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
