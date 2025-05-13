import { Component } from '@angular/core';
import { FilterSimple } from '../../../../../shared/models/filters/filter-simple.interface';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthTokenService } from '../../../../../shared/services/auth-token.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../../../../core/components/modals/confirm/confirm-modal/confirm-modal.component';
import { ErrorModalComponent } from '../../../../../core/components/modals/error/error-modal.component';
import { ProdutoInterface } from '../model/produto.interface';
import { ProdutoStore } from '../store/produto.store';

@Component({
  selector: 'app-produto-list',
  templateUrl: './produto-list.component.html',
  styleUrl: './produto-list.component.scss'
})
export class ProdutoListComponent {
  produtos!: ProdutoInterface[];
  filter: FilterSimple = {nome: '', idsCategoria: []}

  constructor(
    private produtoStore: ProdutoStore, 
    private route: Router, 
    private spinner: NgxSpinnerService, 
    private authTokenService: AuthTokenService,
    private modalService: NgbModal
  ){}

  ngOnInit(): void {
    this.search()
  }

  goToAdd(){
    this.route.navigate(['administrador/produto/form'], {queryParams: {id: ''}})
  }

  goToView(id: number){
    this.route.navigate(['administrador/produto/form'], {queryParams: {id: id}})
  }

  changeStatus(id: number, dataExclusao: any){
    const modalRef = this.modalService.open(ConfirmModalComponent, { backdrop: 'static', keyboard: false })
    modalRef.componentInstance.message =  `Deseja realmente ${dataExclusao ? 'ativar' : 'inativar'} esse produto?`
    modalRef.result.then(
      (result) => {
        this.produtoStore.desativarAtivarProduto(id).subscribe({
          next: (data)=>{
            this.search()
          },
          error: (err) =>{
            this._openModal(ErrorModalComponent, err?.error?.message, {})
          }
        })
      },
      (reason) => {}
    )

  }

  goBack(){
    this.route.navigate([''])
  }

  search(){
    this.spinner.show()
    this.produtoStore.search(this.filter).subscribe({
      next: (data)=>{
        this.produtos = data
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

