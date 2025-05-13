import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthTokenService } from '../../../../shared/services/auth-token.service';
import { EnderecoStore } from '../../views/endereco/store/endereco.store';
import { NgxSpinnerService } from 'ngx-spinner';
import { EnderecoInterface } from '../../views/endereco/models/endereco.interface';
import { ErrorModalComponent } from '../../../../core/components/modals/error/error-modal.component';
import { TipoPagamentoEnum, TipoPagamentoEnumSelect } from '../../../../shared/models/enums/tipo-pagamento.enum';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PedidoStore } from '../../../admin/views/pedido/stores/pedido.store';
import { PedidoInterface } from '../../../admin/views/pedido/model/pedido.interface';
import { StatusPedidoEnum } from '../../../../shared/models/enums/status-pedido.enum';
import { CarrinhoService } from '../../../../shared/services/carrinho.service';
import { SucessModalComponent } from '../../../../core/components/modals/sucess/sucess-modal.component';

@Component({
  selector: 'app-finalizar-pedido-modal',
  templateUrl: './finalizar-pedido-modal.component.html',
  styleUrl: './finalizar-pedido-modal.component.scss'
})
export class FinalizarPedidoModalComponent implements OnInit {
  tiposPagamentosOptions!: {value: string, description: string}[]
  yesOrNoOptions!: {value: boolean, description: string}[]
  idUsuario!: number
  enderecos!: EnderecoInterface[]
  @Input() valorTotal!: number
  @Input() idCarrinho!: number
  enderecoIdSelecionado!: number
  form!: FormGroup
  isCash: boolean = false
  needChange: boolean = false
  isTaxaFree: boolean = true

  constructor(
    private activeModal: NgbActiveModal,
    private authTokenService: AuthTokenService,
    private enderecoStore: EnderecoStore,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private route: Router,
    private formBuilder: FormBuilder,
    private pedidoStore: PedidoStore,
    private carrinhoService: CarrinhoService,
  ){}
  
  get valorFinalPedido(){
    if(this.form.get('enderecoId')?.getRawValue() == 0){
      this.isTaxaFree = true
      return this.valorTotal
    }else{
      this.isTaxaFree = false
      return Number(this.valorTotal) + Number(3)
    }
  }  

  ngOnInit(): void {   
    this.idUsuario = this.authTokenService.getIdUsuario()
    this._loadSelects();
    this._initForm()
    this.spinner.show()
    this.enderecoStore.getAllByUsuario(this.idUsuario).subscribe({      
      next: (data) => {
        this.enderecos = data
        this.spinner.hide()
      },
      error: (err) =>{
        this.spinner.hide()
        this._openModal(ErrorModalComponent, err, {})
      }
    })

    this.form.get('enderecoId')?.valueChanges.subscribe(id => {
      this.valorFinalPedido
    });
    
  }


  goToEndereco() {
    this.route.navigate(['/endereco/form'], 
      {
        queryParams: {idUsuario: this.idUsuario, idEndereco: '', idCarrinho: this.idCarrinho, valorTotal: this.valorTotal}, 
        state: {returnUrl: this.route.url }
      })
    this.activeModal.close()
  }
  
  isValidForm(identificador: string) {
    return (this.form.get(identificador)?.touched && !this.form.get(identificador)?.valid) ?? false
  }

  confirm() {
    if(this.form.invalid){
      this.form.markAllAsTouched()
      return
    }

    if(this.needChange && this._isValorValido()){
      return
    }
    
    this.spinner.show()
    this.pedidoStore.save(this.idCarrinho, this._normalizeFields()).subscribe({
      next: (data) =>{
        this.spinner.hide()
        this.carrinhoService.limparCarrinho()
        this.activeModal.close()
        this._openModal(SucessModalComponent, 'Pedido realizado com sucesso', this.route.navigate(['/pedidos']))
      },
      error: (err) => {
        this.spinner.hide()
        this._openModal(ErrorModalComponent, err, {})
      }
    })

  }
  
  voltar() {
    this.activeModal.close()
  }

  handleFormaPagamento() {
    if(this.form.get('formaPagamento')?.getRawValue() == TipoPagamentoEnum.DINHEIRO){
      this.isCash = true;
      this.form.get('precisaTroco')?.addValidators(Validators.required) 
    }else{
      this.isCash = false
      this.form.get('precisaTroco')?.removeValidators(Validators.required) 
      this.form.get('precisaTroco')?.setValue(null)
      this.form.get('precisaTroco')?.markAsUntouched()
      this.handlePrecisaTroco()
    }
  }

  handlePrecisaTroco() {    
    if(this.form.get('precisaTroco')?.getRawValue() == true){
      this.needChange = true;
      this.form.get('valorTroco')?.addValidators(Validators.required) 
    }else{
      this.needChange = false;
      this.form.get('valorTroco')?.removeValidators(Validators.required) 
      this.form.get('valorTroco')?.markAsUntouched()
      this.form.get('valorTroco')?.setValue(null)
    }
  }

  private _normalizeFields(){
    let rawValue = this.form.getRawValue()

    return{
      id: null,
      valor: this.valorFinalPedido,
      statusPedido: StatusPedidoEnum.AGUARDANDO_CONFIRMACAO,
      dataPedido: null,
      dataFechamentoPedido: null,
      usuario: {
        id: this.idUsuario
      },
      endereco: rawValue.enderecoId ? {id: rawValue.enderecoId}: null,
      formaPagamento: rawValue.formaPagamento,
      precisaTroco: rawValue.precisaTroco,
      valorTroco: rawValue.valorTroco,
      produtosPedido: null,
    }as PedidoInterface
  }

  private _isValorValido() {
    if(this.form.get('valor')?.getRawValue() == 0){
      this._openModal(ErrorModalComponent, 'Produto com o valor zerado', {})
      return true
    }
    return false
  }

  private _initForm() {
    this.form = this.formBuilder.group({
      enderecoId: [0, Validators.required],
      formaPagamento: [null, Validators.required],
      precisaTroco: [null],
      valorTroco: [null],
    })
  }

  private _loadSelects() {
    this.tiposPagamentosOptions = TipoPagamentoEnumSelect
    this.yesOrNoOptions = [{value: true, description: 'Sim'}, {value: false, description: 'Não'}]
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
