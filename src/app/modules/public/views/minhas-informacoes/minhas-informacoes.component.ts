import { Component, OnInit } from '@angular/core';
import { AuthTokenService } from '../../../../shared/services/auth-token.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioStore } from '../../../admin/views/usuario/stores/usuario.store';
import { ErrorModalComponent } from '../../../../core/components/modals/error/error-modal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionType } from '../../../../shared/models/enums/action-type.enum';
import { SucessModalComponent } from '../../../../core/components/modals/sucess/sucess-modal.component';
import { Router } from '@angular/router';
import { InfoUsuario } from '../../../../shared/models/info-usuario.interface';

@Component({
  selector: 'app-minhas-informacoes',
  templateUrl: './minhas-informacoes.component.html',
  styleUrl: './minhas-informacoes.component.scss'
})
export class MinhasInformacoesComponent implements OnInit {
  idUsuario!: number
  form!: FormGroup
  action: ActionType = ActionType.VIEW
  roleUsuario!: string

  constructor(
    private authTokenService: AuthTokenService,
    private usuarioStore: UsuarioStore,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private route: Router,
  ){}

    get isCreate(){
      return this.action==ActionType.CREATE
    }
  
    get isView(){
      return this.action==ActionType.VIEW
    }

  ngOnInit(): void {
    this.action = ActionType.VIEW
    this._initForm()
    this.spinner.show()
    this.idUsuario = this.authTokenService.getIdUsuario()
    this.roleUsuario = this.authTokenService.getRoleUsuario()
    this.usuarioStore.getById(this.idUsuario).subscribe({
      next: (data) => {
        this.spinner.hide()
        this.form.patchValue(data)
        this.form.disable()
      },
      error: (err) => {
        this.spinner.hide()
        const errorMessage = err?.error?.message ?? 'Erro inesperado';
        this._openModal(ErrorModalComponent, errorMessage, {}) 
      }
    })

  }

  isValidForm(identificador: string) {
    return (this.form.get(identificador)?.touched && !this.form.get(identificador)?.valid) ?? false
  }

  isValidSubForm(identificador: string) {
    return (this.form.get('pessoa')?.get(identificador)?.touched && !this.form.get('pessoa')?.get(identificador)?.valid) ?? false
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
    this.usuarioStore.save(this._normalizeFields()).subscribe({
      next: (data: any) => {
        this.spinner.hide()
        this._openModal(SucessModalComponent, 'Informações cadastradas com sucesso', this.route.navigate(['/']))
        let info = {id: this.idUsuario, name: data.pessoa.nome, email: data.email, role: this.roleUsuario} as InfoUsuario
        this.authTokenService.atualizarUsuario(info);
      },
      error: (error: any) => {
        this.spinner.hide()
        const errorMessage = error?.error?.message ?? 'Erro inesperado';
        this._openModal(ErrorModalComponent, errorMessage, {})
      }
    })   

  }

  private _initForm() {
    this.form = this.formBuilder.group({
      email: [null, Validators.required],
      pessoa: this.formBuilder.group({
        id: [null, Validators.required],
        nome: [null, Validators.required],
        cpf: [null, Validators.required],
        dataNascimento: [null, Validators.required],
        telefone: [null, Validators.required],
      })
    })
  }

  private _normalizeFields(): any {
    let rawValue = this.form.getRawValue()
    return {
      id: this.idUsuario,
      email: rawValue.email,
      pessoa: {
        id: rawValue.pessoa.id,
        nome: rawValue.pessoa.nome,
        cpf: rawValue.pessoa.cpf,
        dataNascimento: rawValue.pessoa.dataNascimento,
        telefone: rawValue.pessoa.telefone
      }
    }
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
