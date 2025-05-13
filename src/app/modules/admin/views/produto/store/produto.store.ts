import { Injectable } from "@angular/core"
import { environment } from "../../../../../environments/environment"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { ProdutoInterface } from "../model/produto.interface"
import { FilterSimple } from "../../../../../shared/models/filters/filter-simple.interface"

@Injectable({
  providedIn: 'root', 
})
export class ProdutoStore {

  private readonly baseUrl = `${environment.url}produto/`


  constructor(private http: HttpClient) { }

  save(produto: ProdutoInterface): Observable<ProdutoInterface> {
    return this.http.post<any>(this.baseUrl, produto)
  }

  getById(id: number): Observable<ProdutoInterface> {
    return this.http.get<any>(this.baseUrl + id)
  }

  getAll(): Observable<ProdutoInterface[]> {
    return this.http.get<any>(this.baseUrl)
  }

  desativarAtivarProduto(id: number): Observable<ProdutoInterface>{
    return this.http.get<any>(this.baseUrl + 'desativar-ativar/' + id )
  }

  getAllByIdCategoria(id: number): Observable<ProdutoInterface[]>{
    return this.http.get<any>(this.baseUrl + 'produto-by-categoria/' + id )
  }

  search(filter: FilterSimple): Observable<ProdutoInterface[]> {
    return this.http.post<any>(this.baseUrl + 'search', filter)
  }

  searchActive(filter: FilterSimple): Observable<ProdutoInterface[]> {
    return this.http.post<any>(this.baseUrl + 'search-active', filter)
  }

  searchGridProdCat(filter: FilterSimple): Observable<ProdutoInterface[]> {
    return this.http.post<any>(this.baseUrl + 'search-grid', filter)
  }

}