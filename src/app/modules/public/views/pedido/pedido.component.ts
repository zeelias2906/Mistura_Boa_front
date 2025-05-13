import { Component, OnInit } from '@angular/core';
import { PedidoInterface } from '../../../admin/views/pedido/model/pedido.interface';
import { AuthTokenService } from '../../../../shared/services/auth-token.service';
import { PedidoStore } from '../../../admin/views/pedido/stores/pedido.store';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorModalComponent } from '../../../../core/components/modals/error/error-modal.component';
import { Router } from '@angular/router';
import { getStatusPedidoEnum } from '../../../../shared/models/enums/status-pedido.enum';
import { getTipoPagamentoEnum, TipoPagamentoEnum } from '../../../../shared/models/enums/tipo-pagamento.enum';
import { ProdutoPedidoInterface } from '../../../admin/views/pedido/model/produto-pedido.interface';
import { ConfirmModalComponent } from '../../../../core/components/modals/confirm/confirm-modal/confirm-modal.component';
import { ProdutosPedidoModalComponent } from '../../modals/produtos-pedido-modal/produtos-pedido-modal.component';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.scss'
})
export class PedidoComponent implements OnInit {
  idUsuario!: number
  pedidos!: PedidoInterface[]

  constructor(
    private authTokenService: AuthTokenService,
    private pedidoStore: PedidoStore,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private route: Router,
  )
  {}

  getStatus(status: any){
    return getStatusPedidoEnum(status);
  }

  getTipoPagamento(tipo: TipoPagamentoEnum) {
   return getTipoPagamentoEnum(tipo)
  }

  ngOnInit(): void {
    this.idUsuario = this.authTokenService.getIdUsuario()
    this.spinner.show()
    this.pedidoStore.getByIdUsaurio(this.idUsuario).subscribe({
      next: (data) =>{
        this.pedidos = data
        this.spinner.hide()
      },
      error: (err) => {
        this.spinner.hide()
        const errorMessage = err?.error?.message ?? 'Erro inesperado';
        this._openModal(ErrorModalComponent, errorMessage, {}) 
      }
    })
  }

  viewsProdutos(idPedido: number,produtosPedido: ProdutoPedidoInterface[]) {
    const modalRef = this.modalService.open(ProdutosPedidoModalComponent, { backdrop: 'static', keyboard: false })
    modalRef.componentInstance.idPedido = idPedido
    modalRef.componentInstance.produtosPedido = produtosPedido
  }

  cancelPedido(idPedido: number) {
    const modalRef = this.modalService.open(ConfirmModalComponent, { backdrop: 'static', keyboard: false })
    modalRef.componentInstance.message = 'Deseja  realmente cancelar esse pedido?'
    modalRef.result.then(
      (result) => {
        this._cancelByClient(idPedido);
      },
      (reason) => {}
      )
      
  }

  private _cancelByClient(idPedido: number){
    this.spinner.show()
    this.pedidoStore.cancelByClient(idPedido).subscribe({
      next: (data) =>{
        this.spinner.hide()
        this.ngOnInit()
      },
      error: (err) =>{
        this.spinner.hide()
        const errorMessage = err?.error?.message ?? 'Erro inesperado';
        this._openModal(ErrorModalComponent, errorMessage, {}) 
      }
    })
  }

  private _openModal(modalOptions: any, message: string, action: any){
    const modalRef = this.modalService.open(modalOptions, { backdrop: 'static', keyboard: false })
    modalRef.componentInstance.message = message
    modalRef.result.then(
      (result) => {
        action
      }
    )
  }

}
