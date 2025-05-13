import { StatusPedidoEnum } from "../../../../../shared/models/enums/status-pedido.enum"
import { TipoPagamentoEnum } from "../../../../../shared/models/enums/tipo-pagamento.enum"
import { UsuarioInterface } from "../../../../../shared/models/usuario.interface"
import { EnderecoInterface } from "../../../../public/views/endereco/models/endereco.interface"
import { ProdutoPedidoInterface } from "./produto-pedido.interface"

export interface PedidoInterface{
    id: number | null
    numeroPedido: number 
    valor: number
    statusPedido: StatusPedidoEnum
    justificativa: string
    dataPedido: Date | null
    dataFechamentoPedido: Date | null
    usuario: UsuarioInterface
    endereco: EnderecoInterface | null
    formaPagamento: TipoPagamentoEnum
    precisaTroco: boolean | null,
    valorTroco: number | null,
    produtosPedido: ProdutoPedidoInterface[] | null
}