import { Component, OnInit } from '@angular/core';
import { AuthTokenService } from '../../../shared/services/auth-token.service';
import { InfoUsuario } from '../../../shared/models/info-usuario.interface';
import { SearchService } from '../../../shared/services/search.service';
import { CarrinhoService } from '../../../shared/services/carrinho.service';
import { Router } from '@angular/router';

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

  constructor(
    private authTokenService: AuthTokenService, 
    private searchService: SearchService, 
    private carrinhoService: CarrinhoService, 
    private route: Router,
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

  private _validateToken(){
    if(this.authTokenService.decodePayloadJWT() != null && !this.authTokenService.decodePayloadJWT()!.isExpired){
      this.isLogado = !this.isLogado
      this.usuario = this.authTokenService.getInfoUsuario()
    }
  }

}
