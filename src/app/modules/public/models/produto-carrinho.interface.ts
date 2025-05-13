import { ProdutoInterface } from "../../admin/views/produto/model/produto.interface"
import { CarrinhoInterface } from "./carrinho.interface"

export interface ProdutoCarrinhoInterface{
    id: number| null
    observacao: string
    produto: ProdutoInterface
    carrinho: CarrinhoInterface | null
}