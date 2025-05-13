export enum StatusPedidoEnum {
  AGUARDANDO_CONFIRMACAO = 'AGUARDANDO_CONFIRMACAO',
  EM_PREPARACAO = 'EM_PREPARACAO',
  RECUSADO = 'RECUSADO',
  CANCELADO = 'CANCELADO',
  ENVIADO = 'ENVIADO',
  A_SER_RETIRADO = 'A_SER_RETIRADO',
  FINALIZADO = 'FINALIZADO'
}

export const StatusPedidoEnumSelect = [
  { value: StatusPedidoEnum.AGUARDANDO_CONFIRMACAO, description: 'Aguardando confirmação' },
  { value: StatusPedidoEnum.EM_PREPARACAO, description: 'Em preparação' },
  { value: StatusPedidoEnum.RECUSADO, description: 'Recusado' },
  { value: StatusPedidoEnum.CANCELADO, description: 'Cancelado' },
  { value: StatusPedidoEnum.ENVIADO, description: 'Enviado' },
  { value: StatusPedidoEnum.A_SER_RETIRADO, description: 'A ser retirado' },
  { value: StatusPedidoEnum.FINALIZADO, description: 'Finalizado' },
]

export function getStatusPedidoEnum(status: StatusPedidoEnum): string {
  switch (status) {
    case StatusPedidoEnum.AGUARDANDO_CONFIRMACAO:
      return 'Aguardando pedido ser confirmado pelo restaurante'
    case StatusPedidoEnum.CANCELADO:
      return 'Pedido Cancelado'
    case StatusPedidoEnum.RECUSADO:
      return 'Restaurante não pode aceitar o pedido'
    case StatusPedidoEnum.EM_PREPARACAO:
      return 'Restaurante está preparando o pedido'
    case StatusPedidoEnum.ENVIADO:
      return 'Pedido enviado'
    case StatusPedidoEnum.A_SER_RETIRADO:
      return 'Pedido aguardando ser retirado no estabelecimento'
    case StatusPedidoEnum.FINALIZADO:
      return 'Pedido entregue'
    default:
      return ''
  }
}
