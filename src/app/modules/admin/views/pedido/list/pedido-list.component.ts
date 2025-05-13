import { Component, OnInit } from '@angular/core';
import { FilterSimple } from '../../../../../shared/models/filters/filter-simple.interface';
import { PedidoStore } from '../stores/pedido.store';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthTokenService } from '../../../../../shared/services/auth-token.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../../../../core/components/modals/confirm/confirm-modal/confirm-modal.component';
import { PedidoInterface } from '../model/pedido.interface';
import { ErrorModalComponent } from '../../../../../core/components/modals/error/error-modal.component';
import { getStatusPedidoEnum, StatusPedidoEnum } from '../../../../../shared/models/enums/status-pedido.enum';
import { getTipoPagamentoEnum, TipoPagamentoEnum } from '../../../../../shared/models/enums/tipo-pagamento.enum';
import { JustificativaModalComponent } from '../modals/justificativa-modal/justificativa-modal.component';

@Component({
  selector: 'app-pedido-list',
  templateUrl: './pedido-list.component.html',
  styleUrl: './pedido-list.component.scss'
})
export class PedidoListComponent  implements OnInit{
  statusPedido: StatusPedidoEnum = StatusPedidoEnum.AGUARDANDO_CONFIRMACAO
  pedidoStatus = StatusPedidoEnum

  constructor(
    private pedidoStore: PedidoStore, 
    private route: Router, 
    private spinner: NgxSpinnerService, 
    private authTokenService: AuthTokenService,
    private modalService: NgbModal
  ){}

  ngOnInit(): void {
    this.statusPedido = StatusPedidoEnum.AGUARDANDO_CONFIRMACAO
  }

  goToHistory(){
    this.route.navigate(['administrador/pedido/historico'])
  }

  changeTab(status: StatusPedidoEnum){
    this.statusPedido = status
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
