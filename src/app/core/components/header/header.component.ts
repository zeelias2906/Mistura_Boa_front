import { Component, OnInit } from '@angular/core';
import { AuthTokenService } from '../../../shared/services/auth-token.service';
import { InfoUsuario } from '../../../shared/models/info-usuario.interface';
import { SearchService } from '../../../shared/services/search.service';
import { CarrinhoService } from '../../../shared/services/carrinho.service';
import { Router } from '@angular/router';
import { PedidoAguardandoService } from '../../../shared/services/pedido-aguardando.service';
import { Subscription } from 'rxjs';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  openMenu: boolean = false
  isLogado: boolean = false
  usuario!: InfoUsuario | null
  nomeProduto!: string
  private subscription!: Subscription;
  qtdPedidosAguardando = 0;
  timeoutId: any;

  constructor(
    private authTokenService: AuthTokenService, 
    private searchService: SearchService, 
    private carrinhoService: CarrinhoService, 
    private route: Router,
    private pedidoAguardandoService: PedidoAguardandoService,
    
  ){}

  get isAdmin(){
    return this.usuario?.role == 'ADMIN'
  }

  get isGerente(){
    return this.usuario?.role == 'GERENTE'
  }

  ngOnInit(): void {
    this.isLogado = false
    this._validateToken() 
    this.authTokenService.atualizarUsuario(this.authTokenService.getInfoUsuario())
    this.authTokenService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
    });

    this.subscription = this.pedidoAguardandoService.pedidosMudou.subscribe(pedidos => {
      this.qtdPedidosAguardando = pedidos.length;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logout(){
    this.isLogado = false
    this.authTokenService.logout()
    this.carrinhoService.limparCarrinho()
    this.route.navigate(['/'])
    this._validateToken()
  }

  toggleMenu() {
    this.openMenu = !this.openMenu    
  }

  search(value: string){
    this.searchService.setSearchTerm(value)
  }

  abrirTooltip(t: NgbTooltip) {
    clearTimeout(this.timeoutId);
    t.open();
  }
  
  fecharTooltip(t: NgbTooltip) {
    this.timeoutId = setTimeout(() => t.close(), 2000); // 2 segundos de delay
  }

  private _validateToken(){
    if(this.authTokenService.decodePayloadJWT() != null && !this.authTokenService.decodePayloadJWT()!.isExpired){
      this.isLogado = !this.isLogado
      this.usuario = this.authTokenService.getInfoUsuario()
    }
  }

}
