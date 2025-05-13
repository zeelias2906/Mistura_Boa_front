import { Component, OnInit } from '@angular/core';
import { ActionType } from '../../../../../shared/models/enums/action-type.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnderecoStore } from '../store/endereco.store';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthTokenService } from '../../../../../shared/services/auth-token.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorModalComponent } from '../../../../../core/components/modals/error/error-modal.component';
import { ConfirmModalComponent } from '../../../../../core/components/modals/confirm/confirm-modal/confirm-modal.component';
import { SucessModalComponent } from '../../../../../core/components/modals/sucess/sucess-modal.component';
import { EnderecoInterface } from '../models/endereco.interface';
import { UsuarioInterface } from '../../../../../shared/models/usuario.interface';
import { FinalizarPedidoModalComponent } from '../../../modals/finalizar-pedido-modal/finalizar-pedido-modal.component';

@Component({
  selector: 'app-endereco-register',
  templateUrl: './endereco-register.component.html',
  styleUrl: './endereco-register.component.scss'
})
export class EnderecoRegisterComponent implements OnInit {  
  action: ActionType = ActionType.CREATE
  idUsuario!: any
  idEndereco!: any
  idCarrinho!: number
  valorTotal!: number 
  form!: FormGroup 


  constructor(
    private enderecoStore: EnderecoStore, 
    private route: Router, 
    private activedRoute: ActivatedRoute, 
    private spinner: NgxSpinnerService, 
    private authTokenService: AuthTokenService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,  
  ){}

  private _openModal(modalOptions: any, message: string, action: any){
    const modalRef = this.modalService.open(modalOptions, { backdrop: 'static', keyboard: false })
    modalRef.componentInstance.message = message
    modalRef.result.then(
      (result) => {
        action
      }
    )
  }

  get isCreate(){
    return this.action==ActionType.CREATE
  }

  get isView(){
    return this.action==ActionType.VIEW
  }

  private _initForm() {
    this.form = this.formBuilder.group({
      nome: [null, Validators.required],
      logradouro: [null, Validators.required],
      numero: [null, Validators.required],
      bairro: [null, Validators.required],
      complemento: [null],
      pontoReferencia: [null],
    })
  }

  isValidForm(identificador: string) {
    return (this.form.get(identificador)?.touched && !this.form.get(identificador)?.valid) ?? false
  }

  ngOnInit(): void {
    this.spinner.show()
    this._initForm()
    this.activedRoute.queryParams.subscribe(
      params => {
        this.idEndereco = params['idEndereco']
        this.idUsuario = params['idUsuario']
        this.idCarrinho = params['idCarrinho']
        this.valorTotal = params['valorTotal']
        if(this.idEndereco==''){
          this.action = ActionType.CREATE
          this.spinner.hide()
        }
        else{
          this.action = ActionType.VIEW
          this.form.disable()
          this._loadModels();
        }
      }
    )
  }

  private _loadModels() {
    this.enderecoStore.getById(this.idEndereco).subscribe({
      next: (data) =>{
        this.form.patchValue(data)
        this.spinner.hide()
      },
      error: (error: any) => {
        this.spinner.hide()
        const errorMessage = error.error?.message ?? 'Erro inesperado';
        this._openModal(ErrorModalComponent, errorMessage, {})
      }
    })
  }


  editar(){
    this.action = ActionType.EDIT
    this.form.enable()
  }
  
  voltar(){
    if(this.form.touched && this.action == ActionType.CREATE){
      const modalRef = this.modalService.open(ConfirmModalComponent, { backdrop: 'static', keyboard: false })
      modalRef.componentInstance.message = 'Ao voltar todas as informações serão perdidas'
      modalRef.result.then(
        (result) => {
          this._navigate()
        },
        (reason) => {}
      )
      return
    }
    this._navigate()
  }
  
  salvar(){
    console.log(this.form)
    if(!this.isCreate){
      this.form.enable()
      this.action = ActionType.CREATE
      return
    }

    if(this.form.invalid){
      this._openModal(ErrorModalComponent, 'Campos obrigatórios a serem preenchidos', this.form.markAllAsTouched())
      return
    }

    this.spinner.show()
    this.enderecoStore.save(this._patchValue()).subscribe({
      next: (data: any) => {
        this.spinner.hide()
        this._openModal(SucessModalComponent, 'Endereço cadastrado com sucesso', this._navigate())
      },
      error: (error: any) => {
        this.spinner.hide()
        const errorMessage = error?.error?.message ?? 'Erro inesperado';
        this._openModal(ErrorModalComponent, errorMessage, {})
      }
    })
    
  }

  private _navigate() {
    const returnUrl = history.state?.returnUrl ?? '/endereco';
    if(returnUrl != '/endereco'){
      this.route.navigate([returnUrl]);
      const modalRef = this.modalService.open(FinalizarPedidoModalComponent, { backdrop: 'static', keyboard: false })
      modalRef.componentInstance.idCarrinho = this.idCarrinho
      modalRef.componentInstance.valorTotal = this.valorTotal
    }else{
      this.route.navigate([returnUrl]);
    }
    
  }


  private _patchValue():EnderecoInterface {
    let rawValue = this.form.getRawValue()

    return{
      id: this.idEndereco,
      logradouro: rawValue.logradouro,
      nome: rawValue.nome,
      numero: rawValue.numero,
      bairro: rawValue.bairro,
      complemento: rawValue.complemento,
      pontoReferencia: rawValue.pontoReferencia,
      usuario: {
        id: this.idUsuario
      } as UsuarioInterface,
    }
  }


}

