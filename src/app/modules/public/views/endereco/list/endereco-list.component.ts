import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { EnderecoStore } from '../store/endereco.store';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnderecoInterface } from '../models/endereco.interface';
import { AuthTokenService } from '../../../../../shared/services/auth-token.service';
import { ErrorModalComponent } from '../../../../../core/components/modals/error/error-modal.component';
import { Router } from '@angular/router';
import { ConfirmModalComponent } from '../../../../../core/components/modals/confirm/confirm-modal/confirm-modal.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-endereco-list',
  templateUrl: './endereco-list.component.html',
  styleUrl: './endereco-list.component.scss'
})
export class EnderecoListComponent implements OnInit {
  enderecos!: EnderecoInterface[]
  idUsuario!: number

  constructor(    
      private enderecoStore: EnderecoStore, 
      private route: Router, 
      private authTokenService: AuthTokenService,
      private spinner: NgxSpinnerService, 
      private modalService: NgbModal,
      @Inject(PLATFORM_ID) private platformId: Object
    ){}

  ngOnInit(): void {
    this.idUsuario = this.authTokenService.getIdUsuario()
    this.spinner.show()
    this.enderecoStore.getAllByUsuario(this.idUsuario).subscribe({
      next: (data) => {
        this.enderecos=data
        this.spinner.hide()
      },
      error: (err) => {
        this.spinner.hide()
        const errorMessage = err?.error?.message ?? 'Erro inesperado';
        this._openModal(ErrorModalComponent, errorMessage, {})
      }
    })
  }

  goToAdd(){
    this.route.navigate(['/endereco/form'], {queryParams: {idUsuario: this.idUsuario, idEndereco: ''}})
  }

  goToView(id: number){
    this.route.navigate(['/endereco/form'], {queryParams: {idUsuario: this.idUsuario, idEndereco: id}})
  }

  goBack(){
    this.route.navigate([''])
  }

  excluir(id: number) {
    const modalRef = this.modalService.open(ConfirmModalComponent, { backdrop: 'static', keyboard: false })
    modalRef.componentInstance.message =  `Deseja realmente excluir esse endereço?`
    modalRef.result.then(
      (result) => {
        this.spinner.show()
        this.enderecoStore.delete(id).subscribe({
          next: () =>{
            this.spinner.hide()
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
