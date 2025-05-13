import { Component, OnInit } from '@angular/core';
import { CarrinhoService } from '../../services/carrinho.service';

@Component({
  selector: 'app-float-cart-button',
  templateUrl: './float-cart-button.component.html',
  styleUrl: './float-cart-button.component.scss'
})
export class FloatCartButtonComponent implements OnInit {
  showButton = false;
  quantidade = 0;

  constructor(private readonly carrinhoService: CarrinhoService) {}

  ngOnInit(): void {
    this.carrinhoService.carrinhoMudou.subscribe(itens => {
      this.quantidade = itens.length;
      this.showButton = this.quantidade > 0;
    });
  }

}
