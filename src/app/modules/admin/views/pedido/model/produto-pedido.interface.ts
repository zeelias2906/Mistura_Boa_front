import { ProdutoInterface } from "../../produto/model/produto.interface"

export interface ProdutoPedidoInterface{
    id: number| null
    observacao: string,
    produto: ProdutoInterface
}