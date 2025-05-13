import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProdutoStore } from '../../../admin/views/produto/store/produto.store';
import { ProdutoInterface } from '../../../admin/views/produto/model/produto.interface';
import { ErrorModalComponent } from '../../../../core/components/modals/error/error-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthTokenService } from '../../../../shared/services/auth-token.service';
import { CarrinhoStore } from '../../stores/carrinho.store';
import { Router } from '@angular/router';
import { ConfirmModalComponent } from '../../../../core/components/modals/confirm/confirm-modal/confirm-modal.component';
import { CarrinhoInterface } from '../../models/carrinho.interface';
import { SucessModalComponent } from '../../../../core/components/modals/sucess/sucess-modal.component';
import { CarrinhoService } from '../../../../shared/services/carrinho.service';

@Component({
  selector: 'app-details-produt-modal',
  templateUrl: './details-produt-modal.component.html',
  styleUrl: './details-produt-modal.component.scss'
})
export class DetailsProdutModalComponent implements OnInit {
  produto!: ProdutoInterface
  @Input() idProduto!: number
  idUsuario!: number
  observacao!: string

  constructor(
    private activeModal: NgbActiveModal,
    private produtoStore: ProdutoStore,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private authTokenService: AuthTokenService,
    private carrinhoStore: CarrinhoStore,
    private route: Router,
    private carrinhoService: CarrinhoService,
  ){}
  
  
  ngOnInit(): void {
    this.idUsuario = this.authTokenService.getIdUsuario()
    if(this.idProduto){
      this.spinner.show()
      this.produtoStore.getById(this.idProduto).subscribe({      
        next: (data) => {
          this.produto = data
          this.spinner.hide()
        },
        error: (err) =>{
          this.spinner.hide()
          this._openModal(ErrorModalComponent, err, {})
        }
      })
    }
  }

  confirm() {
    if(!this.authTokenService.isTokenValid()){
      const modalRef = this.modalService.open(ConfirmModalComponent, { backdrop: 'static', keyboard: false })
      modalRef.componentInstance.message = 'Para adicionar o produto ao carrinho é necessário fazer login'
      modalRef.result.then(
        (result) => {
          this.activeModal.close()
          this.route.navigate(['/login'])
        },
        (reason) => {}
      )
      return
    }
    this.spinner.show()
    this.carrinhoStore.save(this._normalizeFields()).subscribe({
      next: (data) => {
        this.spinner.hide()
        this.carrinhoService.adicionarItem(data.produtosCarrinho)
        this._openModal(SucessModalComponent, 'Produto adicionado ao carrinho', {})
      },
      error: (err) =>{
        this.spinner.hide()
        this._openModal(ErrorModalComponent, err, {})
      }
    })
    this.activeModal.close()
  }
  
  private _normalizeFields(): CarrinhoInterface {
    
    return{
      id: null,
      valorTotal: null,
      usuario: {
        id: this.idUsuario
      },
      produtosCarrinho: [{
        id: null,
        observacao: this.observacao,
        produto: this.produto,
        carrinho: null
      }]
    } as CarrinhoInterface

  }

  voltar() {
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
