import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { EnderecoListComponent } from './views/endereco/list/endereco-list.component';
import { EnderecoRegisterComponent } from './views/endereco/register/endereco-register.component';
import { CarrinhoComponent } from './views/carrinho/carrinho.component';
import { AuthGuard } from '../../core/interceptor/auth.guard';
import { PedidoComponent } from './views/pedido/pedido.component';
import { MinhasInformacoesComponent } from './views/minhas-informacoes/minhas-informacoes.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'endereco',
    canActivate:[AuthGuard],
    children:[
      {
        path: '',
        component:EnderecoListComponent
      },
      {
        path: 'form',
        component:EnderecoRegisterComponent
      },
  ]
  },
  {
    path: 'carrinho',
    component: CarrinhoComponent,
    canActivate:[AuthGuard],
  },
  {
    path: 'pedidos',
    component: PedidoComponent,
    canActivate:[AuthGuard],
  },
  {
    path: 'minhas-informacoes',
    component: MinhasInformacoesComponent,
    canActivate:[AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
