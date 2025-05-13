import { UsuarioInterface } from "../../../../../shared/models/usuario.interface"

export interface EnderecoInterface {
    id: number
    nome: string
	logradouro: string
	bairro: string
    complemento: string
	pontoReferencia: string
	numero: number
    usuario: UsuarioInterface
}