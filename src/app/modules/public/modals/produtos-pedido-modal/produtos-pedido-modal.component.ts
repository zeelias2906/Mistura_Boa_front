import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthTokenService } from '../../../../shared/services/auth-token.service';
import { Router } from '@angular/router';
import { ProdutoPedidoInterface } from '../../../admin/views/pedido/model/produto-pedido.interface';

@Component({
  selector: 'app-produtos-pedido-modal',
  templateUrl: './produtos-pedido-modal.component.html',
  styleUrl: './produtos-pedido-modal.component.scss'
})
export class ProdutosPedidoModalComponent implements OnInit {
  @Input() idPedido!: number
  @Input() produtosPedido!: ProdutoPedidoInterface[]

  constructor(
    private activeModal: NgbActiveModal,
    private authTokenService: AuthTokenService,
    private route: Router,
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

}
