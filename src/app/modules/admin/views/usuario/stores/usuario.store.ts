import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"

import { UsuarioInterface } from "../../../../../shared/models/usuario.interface"
import { environment } from "../../../../../environments/environment"
import { FilterSimple } from "../../../../../shared/models/filters/filter-simple.interface"

@Injectable({
  providedIn: 'root', 
})
export class UsuarioStore {

  private readonly baseUrl = `${environment.apiUrl}usuario/`


  constructor(private http: HttpClient) { }

  save(usuario: UsuarioInterface): Observable<UsuarioInterface> {
    return this.http.post<any>(this.baseUrl, usuario)
  }

  getById(id: number): Observable<UsuarioInterface> {
    return this.http.get<any>(this.baseUrl + id)
  }

  search(filter: FilterSimple): Observable<UsuarioInterface[]> {
    return this.http.post<any>(this.baseUrl + 'search', filter)
  }

  changeTipoUsuario(id: number, tipoUsuario: any): Observable<UsuarioInterface> {
    return this.http.get<any>(this.baseUrl + 'change-tipo-usuario/'+ id + '/' + tipoUsuario)
  }

}