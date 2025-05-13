export enum TipoPagamentoEnum {
  DINHEIRO = 'DINHEIRO',
  PIX = 'PIX',
  CARTAO = 'CARTAO'
}

export const TipoPagamentoEnumSelect = [
  { value: TipoPagamentoEnum.DINHEIRO, description: 'Dinheiro' },
  { value: TipoPagamentoEnum.PIX, description: 'Pix' },
  { value: TipoPagamentoEnum.CARTAO, description: 'Cartão de crédito/débito' },
]

export function getTipoPagamentoEnum(tipo: TipoPagamentoEnum): string {
  switch (tipo) {
    case TipoPagamentoEnum.DINHEIRO:
      return 'Dinheiro'
    case TipoPagamentoEnum.PIX:
      return 'Pix'
    case TipoPagamentoEnum.CARTAO:
      return 'Cartão de crédito/débito'
    default:
      return ''
  }
}
