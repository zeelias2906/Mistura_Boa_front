import { Injectable } from '@angular/core';
import { ProdutoCarrinhoInterface } from '../../modules/public/models/produto-carrinho.interface';
import { BehaviorSubject } from 'rxjs';
import { CarrinhoStore } from '../../modules/public/stores/carrinho.store';
import { AuthTokenService } from './auth-token.service';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private produtosCarrinho: ProdutoCarrinhoInterface[] = [];
  public carrinhoMudou = new BehaviorSubject<ProdutoCarrinhoInterface[]>([]);

  constructor(
    private readonly carrinhoStore: CarrinhoStore,
    private readonly authTokenService: AuthTokenService,
  ){}

  adicionarItem(itens: ProdutoCarrinhoInterface[]) {
    this.produtosCarrinho = itens;
    this.carrinhoMudou.next(this.produtosCarrinho);
  }

  removerItem(idProdutoCarrinho: number) {
    this.produtosCarrinho = this.produtosCarrinho.filter(item => item.id !== idProdutoCarrinho);
    this.carrinhoMudou.next(this.produtosCarrinho);
  }

  getQuantidade(): number {
    return this.produtosCarrinho.length;
  }


  getItens(): ProdutoCarrinhoInterface[] {
    return this.produtosCarrinho;
  }

  limparCarrinho() {
    this.produtosCarrinho = [];
    this.carrinhoMudou.next([]);
  }

  restaurarCarrinho(): void {
    this.carrinhoStore.getByIdUsaurio(this.authTokenService.getIdUsuario()).subscribe({
      next: (data) =>{
        this.adicionarItem(data.produtosCarrinho)
      },
      error: (err) =>{

      }
    })
  }

}
