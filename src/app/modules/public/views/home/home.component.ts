import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthTokenService } from '../../../../shared/services/auth-token.service';
import { InfoUsuario } from '../../../../shared/models/info-usuario.interface';
import { CategoriaInterface } from '../../../admin/views/categoria/model/categoria.interface';
import { CategoriaStore } from '../../../admin/views/categoria/store/categoria.store';
import { ProdutoStore } from '../../../admin/views/produto/store/produto.store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorModalComponent } from '../../../../core/components/modals/error/error-modal.component';
import { ProdutoInterface } from '../../../admin/views/produto/model/produto.interface';
import { SearchService } from '../../../../shared/services/search.service';
import { FilterSimple } from '../../../../shared/models/filters/filter-simple.interface';
import { DetailsProdutModalComponent } from '../../modals/details-produt-modal/details-produt-modal.component';
import { CarrinhoService } from '../../../../shared/services/carrinho.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  categorias!: CategoriaInterface[]
  produtos!: ProdutoInterface[]
  logado: boolean = true
  usuario: InfoUsuario | null = null
  idCategoriaSelected!: number
  filter: FilterSimple = {nome: '', idsCategoria: []}

  constructor(
    private route: Router, 
    private authTokenService: AuthTokenService,
    private categoriaStore: CategoriaStore,
    private produtoStore: ProdutoStore,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService, 
    private searchService: SearchService,
    private carrinhoService: CarrinhoService,
  ){}

  ngOnInit(): void {
    this.carrinhoService.restaurarCarrinho()
    this.logado = true
    this._validateToken()
    this.searchService.searchTerm$.subscribe((nomeProduto) => {
      this.filter.nome = nomeProduto
      this._loadLists()  
    })
    
  }

  openDetailsProduct(idProduto: number) {
    const modalRef = this.modalService.open(DetailsProdutModalComponent, { backdrop: 'static', keyboard: false })
    modalRef.componentInstance.idProduto = idProduto
  }


  selectedCategoria(idCategoria: number) {
    this.filter.idsCategoria.pop()
    if(idCategoria==this.idCategoriaSelected){
      this.idCategoriaSelected = 0
      this.filter.idsCategoria.pop()
      this._loadLists()
      return
    }

    this.spinner.show()
    this.filter.idsCategoria.push(idCategoria)
    this.produtoStore.search(this.filter).subscribe({
      next: (data) =>{
        this.produtos = data
        this.idCategoriaSelected = idCategoria
        this.spinner.hide()
      },
      error: (err) =>{
        this.spinner.hide()
        this.idCategoriaSelected = idCategoria
        this._openModal(ErrorModalComponent, err, {})
      }
    })
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

  private _validateToken(){
    if(this.authTokenService.decodePayloadJWT() != null && !this.authTokenService.decodePayloadJWT()?.isExpired){
      this.logado = !this.logado
      this.usuario = this.authTokenService.getInfoUsuario()
    }
  }

  private _loadLists() {
    this.spinner.show()
    this.produtoStore.searchGridProdCat(this.filter).subscribe({
      next: (data) => {
        this.produtos = data.map((item: any) => ({
          id: item.idProduto,
          descricao: item.descricaoProduto,
          nome: item.nomeProduto,
          dataExclusao: null,
          valor: item.valorProduto,
          imgProduto: item.imgProduto,
          categoria: {
            id: item.idCategoria,
            descricao: item.descricaoCategoria,
            nome: item.nomeCategoria,
            dataExclusao: null,
            icone: item.iconeCategoria,
          }
        }));
        this.categorias = Array.from(
          new Map(
            data.map((item: any) => [
              item.idCategoria,
              {
                id: item.idCategoria,
                descricao: item.descricaoCategoria,
                nome: item.nomeCategoria,
                dataExclusao: null,
                icone: item.iconeCategoria,
              }
            ])
          ).values())
          
        this.spinner.hide()
      },
      error: (err) =>{
        this.spinner.hide()
        this._openModal(ErrorModalComponent, err, {})
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
