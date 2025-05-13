import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CarrinhoStore } from '../../stores/carrinho.store';
import { AuthTokenService } from '../../../../shared/services/auth-token.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ProdutoCarrinhoInterface } from '../../models/produto-carrinho.interface';
import { CarrinhoInterface } from '../../models/carrinho.interface';
import { ErrorModalComponent } from '../../../../core/components/modals/error/error-modal.component';
import { isPlatformBrowser } from '@angular/common';
import { ConfirmModalComponent } from '../../../../core/components/modals/confirm/confirm-modal/confirm-modal.component';
import { FinalizarPedidoModalComponent } from '../../modals/finalizar-pedido-modal/finalizar-pedido-modal.component';
import { CarrinhoService } from '../../../../shared/services/carrinho.service';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.component.html',
  styleUrl: './carrinho.component.scss'
})
export class CarrinhoComponent implements OnInit {
  idUsuario!: number
  produtosCarrinho!: ProdutoCarrinhoInterface[] 
  carrinho!: CarrinhoInterface

  constructor(
    private carrinhoStore: CarrinhoStore,
    private authTokenService: AuthTokenService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private route: Router,
    private carrinhoService: CarrinhoService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ){}

  ngOnInit(): void {
    this.idUsuario = this.authTokenService.getIdUsuario()
    this.spinner.show()
    this.carrinhoStore.getByIdUsaurio(this.idUsuario).subscribe({
      next: (data) =>{
        this.carrinho = data
        this.produtosCarrinho = data.produtosCarrinho
        this.spinner.hide()
      },
      error: (err) => {
        this.spinner.hide()
        const errorMessage = err?.error?.message ?? 'Erro inesperado';
        this._openModal(ErrorModalComponent, errorMessage, {})
      }
    })      
  }

  goBack(){
    this.route.navigate([''])
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

  finalizarPedido() {
    const modalRef = this.modalService.open(FinalizarPedidoModalComponent, { backdrop: 'static', keyboard: false })
    modalRef.componentInstance.idCarrinho =  this.carrinho.id
    modalRef.componentInstance.valorTotal =  this.carrinho.valorTotal
  }

  excluir(idProdutoCarrinho: number) {
    const modalRef = this.modalService.open(ConfirmModalComponent, { backdrop: 'static', keyboard: false })
    modalRef.componentInstance.message =  `Deseja realmente retirar esse produto do carrinho?`
    modalRef.result.then(
      (result) => {
        this.spinner.show()
        this.carrinhoStore.delete(this.carrinho.id!, idProdutoCarrinho).subscribe({
          next: () =>{
            this.spinner.hide()
            this.carrinhoService.removerItem(idProdutoCarrinho)
            this.ngOnInit()
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

  private _openModal(modalOptions: any, message: string, action: any){
    if (isPlatformBrowser(this.platformId)) {
      const modalRef = this.modalService.open(modalOptions, { backdrop: 'static', keyboard: false })
      modalRef.componentInstance.message = message
      modalRef.result.then(
        (result) => {
          action
        }
      )
    }
  }

}
