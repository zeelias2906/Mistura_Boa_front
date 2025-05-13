import { Injectable } from "@angular/core"
import { environment } from "../../../../../environments/environment"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"

import { EnderecoInterface } from "../models/endereco.interface"

@Injectable({
  providedIn: 'root', 
})
export class EnderecoStore {

  private readonly baseUrl = `${environment.url}endereco/`


  constructor(private http: HttpClient) { }

  save(endereco: EnderecoInterface): Observable<EnderecoInterface> {
    return this.http.post<any>(this.baseUrl, endereco)
  }

  getById(id: number): Observable<EnderecoInterface> {
    return this.http.get<any>(this.baseUrl + id)
  }

  getAllByUsuario(idUsuario: number): Observable<EnderecoInterface[]> {
    return this.http.get<any>(this.baseUrl + 'by-usuario/' + idUsuario)
  }

  delete(id: number): Observable<any>{
    return this.http.delete<any>(this.baseUrl + id )
  }



}