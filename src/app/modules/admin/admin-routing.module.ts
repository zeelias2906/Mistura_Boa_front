import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CategoriaListComponent } from "./views/categoria/list/categoria-list.component";
import { CategoriaRegisterComponent } from "./views/categoria/register/categoria-register.component";
import { ProdutoListComponent } from "./views/produto/list/produto-list.component";
import { ProdutoRegisterComponent } from "./views/produto/register/produto-register.component";
import { PedidoListComponent } from "./views/pedido/list/pedido-list.component";
import { AuthGuard } from "../../core/interceptor/auth.guard";
import { HistoricoPedidoComponent } from "./views/pedido/historico-pedido/historico-pedido.component";
import { UsuarioListComponent } from "./views/usuario/list/usuario-list.component";


const routes: Routes = [
  {
    path: 'categoria',
    children: [
      {
        path: '',
        component: CategoriaListComponent
      },
      {
        path: 'form',
        component: CategoriaRegisterComponent
      }
    ],
    canActivate:[AuthGuard],
  },
  {
    path: 'produto',
    children: [
      {
        path: '',
        component: ProdutoListComponent
      },
      {
        path: 'form',
        component: ProdutoRegisterComponent
      }
    ],
    canActivate:[AuthGuard],
  },
  {
    path: 'pedido',
    children: [
      {
        path: '',
        component: PedidoListComponent
      },
      {
        path: 'historico',
        component: HistoricoPedidoComponent
      },
    ],
    canActivate:[AuthGuard],
  },
  {
    path: 'usuario',
    children: [
      {
        path: '',
        component: UsuarioListComponent
      },
    ],
    canActivate:[AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }