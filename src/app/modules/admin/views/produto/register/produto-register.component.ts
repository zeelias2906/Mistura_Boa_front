import { Component } from '@angular/core';
import { ActionType } from '../../../../../shared/models/enums/action-type.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriaStore } from '../../categoria/store/categoria.store';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthTokenService } from '../../../../../shared/services/auth-token.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../../../../core/components/modals/confirm/confirm-modal/confirm-modal.component';
import { ErrorModalComponent } from '../../../../../core/components/modals/error/error-modal.component';
import { SucessModalComponent } from '../../../../../core/components/modals/sucess/sucess-modal.component';
import { CategoriaInterface } from '../../categoria/model/categoria.interface';
import { ProdutoStore } from '../store/produto.store';
import { ProdutoInterface } from '../model/produto.interface';

@Component({
  selector: 'app-produto-register',
  templateUrl: './produto-register.component.html',
  styleUrl: './produto-register.component.scss'
})
export class ProdutoRegisterComponent {
  mensagem = '';  
  mostrarPicker = false;
  action: ActionType = ActionType.CREATE
  idProduto!: any 
  form!: FormGroup 
  categoriasOptions!: CategoriaInterface[]
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  imageBase64: string | null = null;


  constructor(
    private produtoStore: ProdutoStore, 
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

  get isView(){
    return this.action==ActionType.VIEW
  }

  private _initForm() {
    this.form = this.formBuilder.group({
      descricao: [null, Validators.required],
      nome: [null, Validators.required],
      imgProduto: [null, Validators.required],
      valor: [null, Validators.required],
      categoria: [null, Validators.required],
      dataExclusao: [null],
    })
  }

  isValidForm(identificador: string) {
    return (this.form.get(identificador)?.touched && !this.form.get(identificador)?.valid) ?? false

  }

  ngOnInit(): void {
    this.spinner.show()
    this._loadSelects()
    this._initForm()
    this.activedRoute.queryParams.subscribe(
      params => {
        this.idProduto = params['id']
        if(this.idProduto==''){
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

  private _loadSelects() {
    this.categoriaStore.getAll().subscribe({
      next: (data)=>{
        this.categoriasOptions = data
      },
      error: (err) =>{
        this._openModal(ErrorModalComponent, err?.error?.message, {})
      }
    })
  }

  private _loadModels() {
    this.produtoStore.getById(this.idProduto).subscribe({
      next: (data) =>{
        this.form.patchValue(data)
        this.form.get('categoria')?.patchValue(data.categoria.id)
        this._loadPreview(data.imgProduto)
        

        this.spinner.hide()
      },
      error: (error: any) => {
        this.spinner.hide()
        this._openModal(ErrorModalComponent, error?.error?.message, {})
      }
    })
  }
  private _loadPreview(imgProduto: string) {
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

    this.previewUrl = `data:image/${tipoImagem};base64,${imgProduto}`;
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
          this.route.navigate(['/administrador/produto'])
        },
        (reason) => {}
      )
      return
    }
    this.route.navigate(['/administrador/produto'])
  }
  
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
        this.form.get('imgProduto')?.setValue((reader.result as string).split(',')[1]);
      };
      reader.readAsDataURL(file);
    }else{
      this.previewUrl = null
      this.imageBase64 = null
      this.form.get('imgProduto')?.setValue(null)
    }
  }
  
  salvar(){
    console.log(this.form)
    if(!this.isCreate){
      this.form.enable()
      this.action = ActionType.CREATE
      return
    }

    this._isValorValido()

    if(this.form.invalid){
      this._openModal(ErrorModalComponent, 'Campos obrigatórios a serem preenchidos', this.form.markAllAsTouched())
      return
    }

    this.spinner.show()
    this.produtoStore.save(this._patchValue()).subscribe({
      next: (data: any) => {
        this.spinner.hide()
        this._openModal(SucessModalComponent, 'Produto cadastrado com sucesso', this.route.navigate(['/administrador/produto']))
      },
      error: (error: any) => {
        this.spinner.hide()
        this._openModal(ErrorModalComponent, error?.error?.message, {})
      }
    })
    
  }

  private _isValorValido() {
    if(this.form.get('valor')?.getRawValue() == 0){
      this._openModal(ErrorModalComponent, 'Produto com o valor zerado', {})
    }
  }

  private _patchValue():ProdutoInterface {
    let rawValue = this.form.getRawValue()

    return{
      id: this.idProduto,
      descricao: rawValue.descricao,
      nome: rawValue.nome,
      imgProduto: rawValue.imgProduto,
      valor: rawValue.valor,
      categoria: {
        id: rawValue.categoria
      } as CategoriaInterface,
      dataExclusao: rawValue.dataExclusao,

    }
  }


}

