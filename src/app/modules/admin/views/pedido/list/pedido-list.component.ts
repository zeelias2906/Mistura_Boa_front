import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StatusPedidoEnum } from '../../../../../shared/models/enums/status-pedido.enum';
import { PedidoAguardandoService } from '../../../../../shared/services/pedido-aguardando.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pedido-list',
  templateUrl: './pedido-list.component.html',
  styleUrl: './pedido-list.component.scss'
})
export class PedidoListComponent  implements OnInit{
  statusPedido: StatusPedidoEnum = StatusPedidoEnum.AGUARDANDO_CONFIRMACAO
  pedidoStatus = StatusPedidoEnum
  qtdPedidosAguardando = 0;
  private subscription!: Subscription;

  constructor(
    private route: Router, 
    private pedidoAguardandoService: PedidoAguardandoService,
    private modalService: NgbModal
  ){}

  ngOnInit(): void {
    this.statusPedido = StatusPedidoEnum.AGUARDANDO_CONFIRMACAO
    this.subscription = this.pedidoAguardandoService.pedidosMudou.subscribe(pedidos => {
      this.qtdPedidosAguardando = pedidos.length;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  goToHistory(){
    this.route.navigate(['administrador/pedido/historico'])
  }

  changeTab(status: StatusPedidoEnum){
    this.statusPedido = status
  }

}
