import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioStore } from '../../stores/usuario.store';
import { AuthTokenService } from '../../../../../../shared/services/auth-token.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { SucessModalComponent } from '../../../../../../core/components/modals/sucess/sucess-modal.component';
import { ErrorModalComponent } from '../../../../../../core/components/modals/error/error-modal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-trocar-tipo-usuario',
  templateUrl: './modal-trocar-tipo-usuario.component.html',
  styleUrl: './modal-trocar-tipo-usuario.component.scss'
})
export class ModalTrocarTipoUsuarioComponent implements OnInit {
  @Input() idUsuario!: number
  @Input() tipoUsuario!: string

  form!: FormGroup
  options!: {value: string, description: string}[]

  constructor(
    private activeModal: NgbActiveModal,
    private usuarioStore: UsuarioStore,
    private authTokenService: AuthTokenService,
    private route: Router,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ){}

  ngOnInit(): void {
    if(!this.authTokenService.isTokenValid()){
      this.route.navigate(['/'])
      return
    } 
    this._initForm()
    this._loadModel()
  }

  voltar(){
    this.activeModal.close()
  }
    
  isValidForm(identificador: string) {
    return (this.form.get(identificador)?.touched && !this.form.get(identificador)?.valid) ?? false
  }


  confirm(){
    if(this.form.invalid){
      this.form.markAllAsTouched()
      return
    }
    this.spinner.show()
    this.usuarioStore.changeTipoUsuario(this.idUsuario, this.form.get('newTipoUsuario')!.getRawValue()).subscribe({
      next: () =>{
        this.spinner.hide()
        this._openModal(SucessModalComponent, 'Usuário alterado com sucesso', {}) 
        this.activeModal.close()
      },
      error: (err) =>{
        this.spinner.hide()
        const errorMessage = err?.error?.message ?? 'Erro inesperado';
        this._openModal(ErrorModalComponent, errorMessage, {}) 
      }      
    })
  }

  private _initForm() {
    this.form = this.formBuilder.group({
      newTipoUsuario: [null, Validators.required],
    })
  }

  private _loadModel(){
    let list= [{value: 'GERENTE', description: "Gerente"}, {value: 'CLIENTE', description: "Cliente"}]
    this.options = list.filter((option) => option.value !== this.tipoUsuario)
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
