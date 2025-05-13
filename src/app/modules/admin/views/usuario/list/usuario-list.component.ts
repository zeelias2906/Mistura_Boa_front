import { Component, OnInit } from '@angular/core';
import { UsuarioInterface } from '../../../../../shared/models/usuario.interface';
import { FilterSimple } from '../../../../../shared/models/filters/filter-simple.interface';
import { UsuarioStore } from '../stores/usuario.store';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthTokenService } from '../../../../../shared/services/auth-token.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorModalComponent } from '../../../../../core/components/modals/error/error-modal.component';
import { ModalTrocarTipoUsuarioComponent } from '../modals/modal-trocar-tipo-usuario/modal-trocar-tipo-usuario.component';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.scss'
})
export class UsuarioListComponent implements OnInit {
  usuarios!: UsuarioInterface[];
  nomeCategoria!: string
  filter: FilterSimple = {nome: '', idsCategoria: []}

  constructor(
    private produtoStore: UsuarioStore, 
    private route: Router, 
    private spinner: NgxSpinnerService, 
    private authTokenService: AuthTokenService,
    private modalService: NgbModal
  ){}

  ngOnInit(): void {
      this.search()
  }



  // changeStatus(id: number, dataExclusao: any){
  //   const modalRef = this.modalService.open(ConfirmModalComponent, { backdrop: 'static', keyboard: false })
  //   modalRef.componentInstance.message =  `Deseja realmente ${dataExclusao ? 'ativar' : 'inativar'} essa categoria?`
  //   modalRef.result.then(
  //     (result) => {
  //       this.categoriaStore.desativarAtivarCategoria(id).subscribe({
  //         next: (data)=>{
  //           this.search()
  //         },
  //         error: (err) =>{
  //           this._openModal(ErrorModalComponent, err?.error?.message, {})
  //         }
  //       })
  //     },
  //     (reason) => {}
  //   )

  // }

  goBack(){
    this.route.navigate([''])
  }

  search(){
    this.spinner.show()
    this.produtoStore.search(this.filter).subscribe({
      next: (data)=>{
        this.usuarios = data
        this.spinner.hide()
      },
      error: (err) =>{
        this._openModal(ErrorModalComponent, err, {})
        this.spinner.hide()
      }
    })
  }

  getTipoUsuario(tipo: any): string {
    switch (tipo) {
      case 'CLIENTE':
        return 'Cliente'
      case 'GERENTE':
        return 'Gerente'
      case 'ADMIN':
        return 'Administrador'
      default:
        return ''
    }
  }

  changeTipoUsuario(idUsuario: number, tipoUsuario: any){
    const modalRef = this.modalService.open(ModalTrocarTipoUsuarioComponent, { backdrop: 'static', keyboard: false })
    modalRef.componentInstance.idUsuario = idUsuario
    modalRef.componentInstance.tipoUsuario = tipoUsuario
    modalRef.result.then(
      (result) => {
        this.search()
      }
    )
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
