import { Injectable } from "@angular/core"
import { environment } from "../../../../../environments/environment"
import { HttpClient } from "@angular/common/http"
import { CategoriaInterface } from "../model/categoria.interface"
import { Observable } from "rxjs"
import { FilterSimple } from "../../../../../shared/models/filters/filter-simple.interface"

@Injectable()
export class CategoriaStore {

  private readonly baseUrl = `${environment.apiUrl}categoria/`


  constructor(private http: HttpClient) { }

  save(categoria: CategoriaInterface): Observable<CategoriaInterface> {
    return this.http.post<any>(this.baseUrl, categoria)
  }

  getById(id: number): Observable<CategoriaInterface> {
    return this.http.get<any>(this.baseUrl + id)
  }

  getAll(): Observable<CategoriaInterface[]> {
    return this.http.get<any>(this.baseUrl)
  }

  desativarAtivarCategoria(id: number): Observable<CategoriaInterface>{
    return this.http.get<any>(this.baseUrl + 'desativar-ativar/' + id )
  }

  search(filter: FilterSimple): Observable<CategoriaInterface[]> {
    return this.http.post<any>(this.baseUrl + 'search', filter)
  }

}