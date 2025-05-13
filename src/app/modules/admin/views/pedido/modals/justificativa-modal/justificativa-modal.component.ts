import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthTokenService } from '../../../../../../shared/services/auth-token.service';
import { Router } from '@angular/router';
import { PedidoStore } from '../../stores/pedido.store';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorModalComponent } from '../../../../../../core/components/modals/error/error-modal.component';
import { SucessModalComponent } from '../../../../../../core/components/modals/sucess/sucess-modal.component';

@Component({
  selector: 'app-justificativa-modal',
  templateUrl: './justificativa-modal.component.html',
  styleUrl: './justificativa-modal.component.scss'
})
export class JustificativaModalComponent implements OnInit {
  @Input() idPedido!: number
  justificativa!: string

  constructor(
    private activeModal: NgbActiveModal,
    private route: Router, 
    private spinner: NgxSpinnerService, 
    private authTokenService: AuthTokenService,
    private modalService: NgbModal,
    private pedidoStore: PedidoStore,
  ){}

  ngOnInit(): void {
    if(!this.authTokenService.isTokenValid()){
      this.route.navigate(['/'])
    } 
  }

  voltar(){
    this.activeModal.close()
  }

  confirm(){
    if(!this.justificativa || this.justificativa.length == 0 || this.justificativa == ''){
      this._openModal(ErrorModalComponent, 'É necessário informar a justificativa', {})
      return
    }

    this.spinner.show()
    this.pedidoStore.cancelByRestaurante({idPedido: this.idPedido, justificativa: this.justificativa}).subscribe({
      next: (data) =>{
        this.spinner.hide()
        this._openModal(SucessModalComponent, 'Pedido cancelado com sucesso', {}) 
        this.activeModal.close()
      },
      error: (err) =>{
        this.spinner.hide()
        const errorMessage = err?.error?.message ?? 'Erro inesperado';
        this._openModal(ErrorModalComponent, errorMessage, {}) 
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
