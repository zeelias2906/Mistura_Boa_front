import { Injectable } from '@angular/core';
import { PedidoStore } from '../../modules/admin/views/pedido/stores/pedido.store';
import { StatusPedidoEnum } from '../models/enums/status-pedido.enum';
import { PedidoInterface } from '../../modules/admin/views/pedido/model/pedido.interface';
import { BehaviorSubject, Subscription, switchMap, timer } from 'rxjs';
import { AuthTokenService } from './auth-token.service';

@Injectable({
  providedIn: 'root'
})
export class PedidoAguardandoService {
  private pedidos: PedidoInterface[] = [];
  public pedidosMudou = new BehaviorSubject<PedidoInterface[]>([]);
  private subscription?: Subscription;

  constructor(
    private pedidoStore: PedidoStore,
    private authTokenService: AuthTokenService,
  ){
    this._startPolling()
  }

  adicionarItem(itens: PedidoInterface[]) {
    this.pedidos = itens;
    this.pedidosMudou.next(this.pedidos);
  }

  getQuantidade(): number {
    return this.pedidos.length;
  }

  removerItem(idPedido: number) {
    this.pedidos = this.pedidos.filter(item => item.id !== idPedido);
    this.pedidosMudou.next(this.pedidos);
  }

  // getQtdPedidoAguardando(){
  //   if(!this.authTokenService.getIdUsuario()) return
  //   this.pedidoStore.getAllTodayByStatus(StatusPedidoEnum.AGUARDANDO_CONFIRMACAO).subscribe({
  //     next: (data) => {
  //       this.adicionarItem(data)
  //     }
  //   })
  // }

  stopPolling() {
    this.subscription?.unsubscribe();
  }

  ngOnDestroy() {
    this.stopPolling();
  }

  private _startPolling() {
    if (!this.authTokenService.getIdUsuario()) return;

    this.subscription = timer(0, 10000)
      .pipe(
        switchMap(() =>
          this.pedidoStore.getAllTodayByStatus(StatusPedidoEnum.AGUARDANDO_CONFIRMACAO)
        )
      )
      .subscribe({
        next: (pedidos) => this.adicionarItem(pedidos)
      });
  }


}
