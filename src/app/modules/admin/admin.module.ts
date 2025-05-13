import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, JsonPipe, registerLocaleData } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProdutoListComponent } from './views/produto/list/produto-list.component';
import { ProdutoRegisterComponent } from './views/produto/register/produto-register.component';
import { CategoriaRegisterComponent } from './views/categoria/register/categoria-register.component';
import { CategoriaListComponent } from './views/categoria/list/categoria-list.component';
import { SharedModule } from '../../shared/shared.module';
import { CategoriaStore } from './views/categoria/store/categoria.store';
import { ProdutoStore } from './views/produto/store/produto.store';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { NgbDateParserFormatter, NgbDatepickerI18n, NgbDatepickerModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxCurrencyDirective } from "ngx-currency";
import { PedidoListComponent } from './views/pedido/list/pedido-list.component';
import localePt from '@angular/common/locales/pt';
import { JustificativaModalComponent } from './views/pedido/modals/justificativa-modal/justificativa-modal.component';
import { TabPedidoComponent } from './views/pedido/components/tab-pedido/tab-pedido.component';
import { AceitarPedidoModalComponent } from './views/pedido/modals/aceitar-pedido-modal/aceitar-pedido-modal.component';
import { PedidoStore } from './views/pedido/stores/pedido.store';
import { ImpressaoStore } from './views/pedido/stores/impressao.store';
import { HistoricoPedidoComponent } from './views/pedido/historico-pedido/historico-pedido.component';
import { NgbDateBrParserFormatter } from '../../shared/config/NgbDateBrPaserFormatter';
import { NgbDatepickerI18nPtBr } from '../../shared/config/NgbDatepickerI18nPtBr';
import { UsuarioListComponent } from './views/usuario/list/usuario-list.component';
import { ModalTrocarTipoUsuarioComponent } from './views/usuario/modals/modal-trocar-tipo-usuario/modal-trocar-tipo-usuario.component';

registerLocaleData(localePt, 'pt-BR');

@NgModule({
  declarations: [
    ProdutoListComponent,
    ProdutoRegisterComponent,
    CategoriaRegisterComponent,
    CategoriaListComponent,
    PedidoListComponent,
    JustificativaModalComponent,
    TabPedidoComponent,
    AceitarPedidoModalComponent,
    HistoricoPedidoComponent,
    UsuarioListComponent,
    ModalTrocarTipoUsuarioComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxSpinnerModule,
    AdminRoutingModule,
    SharedModule,
    PickerComponent,
    NgbTooltip,
    NgSelectModule,
    NgxCurrencyDirective,
    NgbDatepickerModule,
    JsonPipe
  ],
  providers:[
    CategoriaStore,
    ProdutoStore,
    PedidoStore,
    ImpressaoStore,
    {provide: NgbDateParserFormatter, useClass: NgbDateBrParserFormatter},
    {provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nPtBr},
    provideNgxMask(),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ]
})
export class AdminModule { }
