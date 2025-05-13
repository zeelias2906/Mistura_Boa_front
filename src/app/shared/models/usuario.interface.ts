import { PessoaInterface } from "./pessoa.interface"

export interface UsuarioInterface{
    id: number
	email: string
	senha: string
	roleUsuario: string
	pessoa: PessoaInterface
}