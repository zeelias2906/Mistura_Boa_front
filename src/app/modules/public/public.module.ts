import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HomeComponent } from './views/home/home.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PublicRoutingModule } from './public-routing.module';
import { EnderecoListComponent } from './views/endereco/list/endereco-list.component';
import { EnderecoRegisterComponent } from './views/endereco/register/endereco-register.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '../../shared/shared.module';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { EnderecoStore } from './views/endereco/store/endereco.store';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { CategoriaStore } from '../admin/views/categoria/store/categoria.store';
import { ProdutoStore } from '../admin/views/produto/store/produto.store';
import localePt from '@angular/common/locales/pt';
import { DetailsProdutModalComponent } from './modals/details-produt-modal/details-produt-modal.component';
import { CarrinhoComponent } from './views/carrinho/carrinho.component';
import { CarrinhoStore } from './stores/carrinho.store';
import { FinalizarPedidoModalComponent } from './modals/finalizar-pedido-modal/finalizar-pedido-modal.component';
import { NgxCurrencyDirective } from 'ngx-currency';
import { PedidoStore } from '../admin/views/pedido/stores/pedido.store';
import { PedidoComponent } from './views/pedido/pedido.component';
import { ProdutosPedidoModalComponent } from './modals/produtos-pedido-modal/produtos-pedido-modal.component';
import { MinhasInformacoesComponent } from './views/minhas-informacoes/minhas-informacoes.component';
import { UsuarioStore } from '../admin/views/usuario/stores/usuario.store';

registerLocaleData(localePt, 'pt-BR');

@NgModule({
  declarations: [
    HomeComponent,
    EnderecoListComponent,
    EnderecoRegisterComponent,
    DetailsProdutModalComponent,
    CarrinhoComponent,
    FinalizarPedidoModalComponent,
    PedidoComponent,
    ProdutosPedidoModalComponent,
    MinhasInformacoesComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltip,
    NgSelectModule,
    FormsModule,
    NgxCurrencyDirective,
  ],
  providers:[
    EnderecoStore,
    CategoriaStore,
    ProdutoStore,
    CarrinhoStore,
    PedidoStore,
    UsuarioStore,
    provideNgxMask(),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ]
  
})
export class PublicModule { }
