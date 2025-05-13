import { Component, OnInit } from '@angular/core';
import { CategoriaStore } from '../store/categoria.store';
import { AuthTokenService } from '../../../../../shared/services/auth-token.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CategoriaInterface } from '../model/categoria.interface';
import { FilterSimple } from '../../../../../shared/models/filters/filter-simple.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorModalComponent } from '../../../../../core/components/modals/error/error-modal.component';
import { ConfirmModalComponent } from '../../../../../core/components/modals/confirm/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-categoria-list',
  templateUrl: './categoria-list.component.html',
  styleUrl: './categoria-list.component.scss'
})
export class CategoriaListComponent implements OnInit {
  categorias!: CategoriaInterface[];
  nomeCategoria!: string
  filter: FilterSimple = {nome: '', idsCategoria: []}

  constructor(
    private categoriaStore: CategoriaStore, 
    private route: Router, 
    private spinner: NgxSpinnerService, 
    private authTokenService: AuthTokenService,
    private modalService: NgbModal
  ){}

  ngOnInit(): void {
      this.search()
  }

  goToAdd(){
    this.route.navigate(['administrador/categoria/form'], {queryParams: {id: ''}})
  }

  goToView(id: number){
    this.route.navigate(['administrador/categoria/form'], {queryParams: {id: id}})
  }

  changeStatus(id: number, dataExclusao: any){
    const modalRef = this.modalService.open(ConfirmModalComponent, { backdrop: 'static', keyboard: false })
    modalRef.componentInstance.message =  `Deseja realmente ${dataExclusao ? 'ativar' : 'inativar'} essa categoria?`
    modalRef.result.then(
      (result) => {
        this.categoriaStore.desativarAtivarCategoria(id).subscribe({
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
    this.categoriaStore.search(this.filter).subscribe({
      next: (data)=>{
        this.categorias = data
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
