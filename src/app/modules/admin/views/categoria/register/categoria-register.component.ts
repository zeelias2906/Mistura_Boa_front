import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CategoriaStore } from '../store/categoria.store';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthTokenService } from '../../../../../shared/services/auth-token.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionType } from '../../../../../shared/models/enums/action-type.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SucessModalComponent } from '../../../../../core/components/modals/sucess/sucess-modal.component';
import { ConfirmModalComponent } from '../../../../../core/components/modals/confirm/confirm-modal/confirm-modal.component';
import { ErrorModalComponent } from '../../../../../core/components/modals/error/error-modal.component';
import { CategoriaInterface } from '../model/categoria.interface';

@Component({
  selector: 'app-categoria-register',
  templateUrl: './categoria-register.component.html',
  styleUrl: './categoria-register.component.scss'
})
export class CategoriaRegisterComponent implements OnInit {
  mensagem = '';
  mostrarPicker = false;
  action: ActionType = ActionType.CREATE
  idCategoria!: any 
  form!: FormGroup 
  @ViewChild('emojiPicker') emojiPicker!: ElementRef;


  constructor(
    private categoriaStore: CategoriaStore, 
    private route: Router, 
    private activedRoute: ActivatedRoute, 
    private spinner: NgxSpinnerService, 
    private authTokenService: AuthTokenService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal  
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

  private _initForm() {
    this.form = this.formBuilder.group({
      descricao: [null, Validators.required],
      nome: [null, Validators.required],
      dataExclusao: [null],
      icone: [null]
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
        this.idCategoria = params['id']
        if(this.idCategoria==''){
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
    this.categoriaStore.getById(this.idCategoria).subscribe({
      next: (data) =>{
        this.form.patchValue(data)
        this.spinner.hide()
      },
      error: (error: any) => {
        this.spinner.hide()
        this._openModal(ErrorModalComponent, error?.error?.message, {})
      }
    })
  }

  adicionarEmoji(event: any) {
    this.form.get('icone')?.setValue(event.emoji.native)
    this.mostrarPicker = false; 
  }

  @HostListener('document:mousedown', ['$event'])
  fecharPicker(event: Event) {
    if (this.emojiPicker && !this.emojiPicker.nativeElement.contains(event.target)) {
      this.mostrarPicker = false;
    }
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
          this.route.navigate(['administrador/categoria'])
        },
        (reason) => {}
      )
      return
    }
    this.route.navigate(['administrador/categoria'])
  }

  salvar(){
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
    this.categoriaStore.save(this._patchValue()).subscribe({
      next: (data: any) => {
        this.spinner.hide()
        this._openModal(SucessModalComponent, 'Categoria Cadastrada com sucesso', this.route.navigate(['administrador/categoria']))
      },
      error: (error: any) => {
        this.spinner.hide()
        this._openModal(ErrorModalComponent, error?.error?.message, {})
      }
    })
    
  }
  private _patchValue():CategoriaInterface {
    let rawValue = this.form.getRawValue()

    return{
      id: this.idCategoria,
      descricao: rawValue.descricao,
      nome: rawValue.nome,
      dataExclusao: rawValue.dataExclusao,
      icone: rawValue.icone
    }
  }


}
