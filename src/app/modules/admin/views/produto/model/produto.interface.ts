import { CategoriaInterface } from "../../categoria/model/categoria.interface"

export interface ProdutoInterface{
    id: number| null
    descricao: string
    nome: string
    dataExclusao: Date | null
    imgProduto: string
    valor: number
    categoria: CategoriaInterface
}