import { Component, Input, OnInit } from '@angular/core';
import { ProdutoPedidoInterface } from '../../model/produto-pedido.interface';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthTokenService } from '../../../../../../shared/services/auth-token.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PedidoStore } from '../../stores/pedido.store';
import { StatusPedidoEnum } from '../../../../../../shared/models/enums/status-pedido.enum';
import { SucessModalComponent } from '../../../../../../core/components/modals/sucess/sucess-modal.component';
import { ErrorModalComponent } from '../../../../../../core/components/modals/error/error-modal.component';

@Component({
  selector: 'app-aceitar-pedido-modal',
  templateUrl: './aceitar-pedido-modal.component.html',
  styleUrl: './aceitar-pedido-modal.component.scss'
})
export class AceitarPedidoModalComponent implements OnInit {
  @Input() idPedido!: number
  @Input() produtosPedido!: ProdutoPedidoInterface[]

  constructor(
    private activeModal: NgbActiveModal,
    private pedidoStore: PedidoStore,
    private authTokenService: AuthTokenService,
    private route: Router,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
  ){}

  ngOnInit(): void {
    if(!this.authTokenService.isTokenValid()){
      this.route.navigate(['/'])
    } 
  }

  voltar(){
    this.activeModal.close()
  }

  loadImg(imgProduto: string) {
    let tipoImagem!: string
    if (imgProduto.startsWith('/9j/')) {
      tipoImagem = 'jpeg';
    } else if (imgProduto.startsWith('iVBOR')) {
      tipoImagem = 'png';
    } else if (imgProduto.startsWith('R0lGOD')) {
      tipoImagem = 'gif';
    }else{
      tipoImagem = 'jpeg';
    }
  
    return `data:image/${tipoImagem};base64,${imgProduto}`;  
  }

  confirm(){
    this.spinner.show()
    this.pedidoStore.changeStatusPedido(this.idPedido, StatusPedidoEnum.EM_PREPARACAO).subscribe({
      next: () =>{
        this.spinner.hide()
        this._openModal(SucessModalComponent, 'Pedido aceito com sucesso', {}) 
        this.activeModal.close()
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
