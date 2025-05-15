import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { getStatusPedidoEnum, StatusPedidoEnum } from '../../../../../../shared/models/enums/status-pedido.enum';
import { getTipoPagamentoEnum, TipoPagamentoEnum } from '../../../../../../shared/models/enums/tipo-pagamento.enum';
import { PedidoInterface } from '../../model/pedido.interface';
import { PedidoStore } from '../../stores/pedido.store';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthTokenService } from '../../../../../../shared/services/auth-token.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorModalComponent } from '../../../../../../core/components/modals/error/error-modal.component';
import { ConfirmModalComponent } from '../../../../../../core/components/modals/confirm/confirm-modal/confirm-modal.component';
import { JustificativaModalComponent } from '../../modals/justificativa-modal/justificativa-modal.component';
import { Router } from '@angular/router';
import { ProdutoPedidoInterface } from '../../model/produto-pedido.interface';
import { AceitarPedidoModalComponent } from '../../modals/aceitar-pedido-modal/aceitar-pedido-modal.component';
import { ProdutosPedidoModalComponent } from '../../../../../public/modals/produtos-pedido-modal/produtos-pedido-modal.component';
import { SucessModalComponent } from '../../../../../../core/components/modals/sucess/sucess-modal.component';
import { ImpressaoStore } from '../../stores/impressao.store';
import { PedidoAguardandoService } from '../../../../../../shared/services/pedido-aguardando.service';

@Component({
  selector: 'app-tab-pedido',
  templateUrl: './tab-pedido.component.html',
  styleUrl: './tab-pedido.component.scss'
})
export class TabPedidoComponent implements OnInit, OnChanges {
  @Input() statusPedido!: StatusPedidoEnum
  pedidos!: PedidoInterface[]
  private intervalId: any;

  constructor(
    private pedidoStore: PedidoStore, 
    private spinner: NgxSpinnerService, 
    private modalService: NgbModal,
    private impressaoStore: ImpressaoStore,
    private pedidoAguardandoService: PedidoAguardandoService,
  ){}

  ngOnInit(): void {
    this._loadPedidos()
    this._startAutoRefresh();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['statusPedido'] && !changes['statusPedido'].firstChange) {
      this._loadPedidos();
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  getStatus(status: any){
    return getStatusPedidoEnum(status);
  }

  getTipoPagamento(tipo: TipoPagamentoEnum) {
   return getTipoPagamentoEnum(tipo)
  }

  aceitarPedido(idPedido: number, produtosPedido: ProdutoPedidoInterface[]){
    const modalRef = this.modalService.open(AceitarPedidoModalComponent, { backdrop: 'static', keyboard: false })
    modalRef.componentInstance.idPedido = idPedido
    modalRef.componentInstance.produtosPedido = produtosPedido
    modalRef.result.then(
      (result) => {
        this._loadPedidos()
        this.pedidoAguardandoService.removerItem(idPedido)
      }
    )
  }

  visualizarProdutos(idPedido: number, produtosPedido: ProdutoPedidoInterface[]){
    const modalRef = this.modalService.open(ProdutosPedidoModalComponent, { backdrop: 'static', keyboard: false })
    modalRef.componentInstance.idPedido = idPedido
    modalRef.componentInstance.produtosPedido = produtosPedido
  }

  cancelPedido(idPedido: number) {
    const modalRef = this.modalService.open(ConfirmModalComponent, { backdrop: 'static', keyboard: false })
    modalRef.componentInstance.message = 'Deseja  realmente cancelar esse pedido?'
    modalRef.result.then(
      (result) => {
        var modalRef = this.modalService.open(JustificativaModalComponent, { backdrop: 'static', keyboard: false })
        modalRef.componentInstance.idPedido = idPedido
        modalRef.result.then(
          (result) => {
            this._loadPedidos()
          }
        )
      },
      (reason) => {}
      )
  }

  imprimirPedido(idPedido: number) {
    this.spinner.show();
    this.impressaoStore.imprimirPedido(idPedido).subscribe({
      next: (res: any) => {
        const base64 = res.body;

        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
      
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
      
        const blobUrl = URL.createObjectURL(blob);
        const printWindow = window.open(blobUrl);
      
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
          };
        }
  
        this.spinner.hide();
      },
      error: (err) => {
        this._openModal(ErrorModalComponent, err, {});
        this.spinner.hide();
      }
    });
  }
  

  pedidoPronto(idPedido: number, isDelivery: boolean){
    const modalRef = this.modalService.open(ConfirmModalComponent, { backdrop: 'static', keyboard: false })
    modalRef.componentInstance.message = "Esse pedido está realmente pronto para ser " + (isDelivery ? "entregue" : "retirado") + "?"
    modalRef.result.then(
      (result) => {
        this.spinner.show()
        this.pedidoStore.changeStatusPedido(idPedido, isDelivery ? StatusPedidoEnum.ENVIADO : StatusPedidoEnum.A_SER_RETIRADO).subscribe({
          next: () =>{
            this.spinner.hide()
            this._openModal(SucessModalComponent, "Pedido a ser " + (isDelivery ? "entregue" : "retirado") , {}) 
            this._loadPedidos()
          },
          error: (err) =>{
            this.spinner.hide()
            const errorMessage = err?.error?.message ?? 'Erro inesperado';
            this._openModal(ErrorModalComponent, errorMessage, {}) 
          }           
        })
      },
      (reason) => {}
      )
  }

  finalizarPedido(idPedido: number, isDelivery: boolean){
    const modalRef = this.modalService.open(ConfirmModalComponent, { backdrop: 'static', keyboard: false })
    modalRef.componentInstance.message = "Esse pedido já foi " + (isDelivery ? "entregue" : "retirado") + "?"
    modalRef.result.then(
      (result) => {
        this.spinner.show()
        this.pedidoStore.changeStatusPedido(idPedido, StatusPedidoEnum.FINALIZADO).subscribe({
          next: () =>{
            this.spinner.hide()
            this._openModal(SucessModalComponent, "Pedido finalizado com sucesso", {}) 
            this._loadPedidos()
          },
          error: (err) =>{
            this.spinner.hide()
            const errorMessage = err?.error?.message ?? 'Erro inesperado';
            this._openModal(ErrorModalComponent, errorMessage, {}) 
          }           
        })
      },
      (reason) => {}
      )
  }
  

  private _startAutoRefresh() {
    this.intervalId = setInterval(() => {
      this._loadPedidos();
    }, 60000);
  }

  private _loadPedidos(){
    this.spinner.show()
    this.pedidoStore.getAllTodayByStatus(this.statusPedido).subscribe({
      next: (data)=>{
        this.pedidos = data
        this.spinner.hide()
      },
      error: (err) =>{
        this._openModal(ErrorModalComponent, err, {})
        this.spinner.hide()
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