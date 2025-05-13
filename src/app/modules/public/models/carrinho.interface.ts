import { UsuarioInterface } from "../../../shared/models/usuario.interface"
import { ProdutoCarrinhoInterface } from "./produto-carrinho.interface"

export interface CarrinhoInterface{
    id: number | null
    valorTotal: number | null
    usuario: UsuarioInterface
    produtosCarrinho: ProdutoCarrinhoInterface[]
}