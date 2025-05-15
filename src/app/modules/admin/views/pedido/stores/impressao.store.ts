import { Injectable } from "@angular/core";
import { environment } from "../../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root', 
})
export class ImpressaoStore {

    private readonly baseUrl = `${environment.apiUrl}/impressao-pedido/`

    constructor(private http: HttpClient){}

    imprimirPedido(idPedido: number): Observable<Blob> {
      return this.http.get<Blob>(this.baseUrl + idPedido);
    }

}