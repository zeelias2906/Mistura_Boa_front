import { Component, inject, OnInit } from '@angular/core';
import { getStatusPedidoEnum, StatusPedidoEnum } from '../../../../../shared/models/enums/status-pedido.enum';
import { PedidoInterface } from '../model/pedido.interface';
import { PedidoStore } from '../stores/pedido.store';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthTokenService } from '../../../../../shared/services/auth-token.service';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PedidoFilterInterface } from '../model/pedido-filter.interface';
import { ErrorModalComponent } from '../../../../../core/components/modals/error/error-modal.component';
import { getTipoPagamentoEnum, TipoPagamentoEnum } from '../../../../../shared/models/enums/tipo-pagamento.enum';
import { ProdutoPedidoInterface } from '../model/produto-pedido.interface';
import { ProdutosPedidoModalComponent } from '../../../../public/modals/produtos-pedido-modal/produtos-pedido-modal.component';
import { ImpressaoStore } from '../stores/impressao.store';

@Component({
  selector: 'app-historico-pedido',
  templateUrl: './historico-pedido.component.html',
  styleUrl: './historico-pedido.component.scss'
})
export class HistoricoPedidoComponent implements OnInit {
  pedidos!: PedidoInterface[]
  filter: PedidoFilterInterface =  {dataInicio: null, dataFim: null}

  calendar = inject(NgbCalendar);
	formatter = inject(NgbDateParserFormatter);

	hoveredDate: NgbDate | null = null;
	fromDate: NgbDate | null = null
	toDate: NgbDate | null = null
  maxSelectableDate: NgbDate = this.calendar.getPrev(this.calendar.getToday(), 'd', 1);

  constructor(
    private pedidoStore: PedidoStore, 
    private route: Router, 
    private spinner: NgxSpinnerService, 
    private authTokenService: AuthTokenService,
    private modalService: NgbModal,
    private impressaoStore: ImpressaoStore
  ){}

	onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
			this.toDate = date;
		} else {
			this.toDate = null;
			this.fromDate = date;
		}
	}

	isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

	validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
		const parsed = this.formatter.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
	}

  ngOnInit(): void {
    this._loadModels();
  }

  getStatus(status: any){
    return getStatusPedidoEnum(status);
  }

  getTipoPagamento(tipo: TipoPagamentoEnum) {
   return getTipoPagamentoEnum(tipo)
  }

  visualizarProdutos(idPedido: number, produtosPedido: ProdutoPedidoInterface[]){
    const modalRef = this.modalService.open(ProdutosPedidoModalComponent, { backdrop: 'static', keyboard: false })
    modalRef.componentInstance.idPedido = idPedido
    modalRef.componentInstance.produtosPedido = produtosPedido
  }

  imprimirPedido(idPedido: number) {
    this.spinner.show();
    this.impressaoStore.imprimirPedido(idPedido).subscribe({
      next: (res: any) => {
        const base64 = res.body;

        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
      
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
      
        const blobUrl = URL.createObjectURL(blob);
        const printWindow = window.open(blobUrl);
      
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
          };
        }
  
        this.spinner.hide();
      },
      error: (err) => {
        this._openModal(ErrorModalComponent, err, {});
        this.spinner.hide();
      }
    });
  }
  
  filtrar(){
    if(this.fromDate){
      this.filter.dataInicio = new Date(this.fromDate!.year, this.fromDate!.month - 1, this.fromDate!.day) 
    }
    if(this.toDate){
      this.filter.dataFim = new Date(this.toDate!.year, this.toDate!.month-1, this.toDate!.day)
    }
    this._loadModels()

    
  }

  private _loadModels() {
    this.spinner.show()
    this.pedidoStore.search(this.filter).subscribe({
      next: (data) =>{
        this.pedidos = data
        this.spinner.hide()
      },
      error: (err) => {
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
