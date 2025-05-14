import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { PedidoInterface } from "../model/pedido.interface";
import { environment } from "../../../../../environments/environment";
import { CancelarPedidoInterface } from "../model/cancelar-pedido.interface";
import { StatusPedidoEnum } from "../../../../../shared/models/enums/status-pedido.enum";
import { PedidoFilterInterface } from "../model/pedido-filter.interface";

@Injectable({
  providedIn: 'root', 
})
export class PedidoStore {

    private readonly baseUrl = `${environment.apiUrl}pedido/`


    constructor(private http: HttpClient) { }

    save(idCarrinho: number, pedido: PedidoInterface): Observable<PedidoInterface> {
        return this.http.post<any>(this.baseUrl + 'save/' + idCarrinho, pedido)
    }
    
    getByIdUsaurio(idUsuario: number): Observable<PedidoInterface[]> {
        return this.http.get<any>(this.baseUrl + 'by-usuario/' + idUsuario)
    }
    
    getById(id: number): Observable<PedidoInterface> {
        return this.http.get<any>(this.baseUrl + id)
    }
    
    getAll(): Observable<PedidoInterface[]> {
        return this.http.get<any>(this.baseUrl)
    }

    getAllTodayByStatus(status: StatusPedidoEnum): Observable<PedidoInterface[]> {
        return this.http.get<any>(this.baseUrl + 'today/' + status)
    }

    changeStatusPedido(id: number, status: StatusPedidoEnum): Observable<PedidoInterface[]> {
        return this.http.get<any>(this.baseUrl + 'change-status/'+ id + '/' + status)
    }

    cancelByClient(id: number): Observable<any> {
        return this.http.get<any>(this.baseUrl + 'cancel-by-client/' + id)
    }

    cancelByRestaurante(cancelarPedido: CancelarPedidoInterface): Observable<any> {
        return this.http.post<any>(this.baseUrl + 'cancel-by-restaurante', cancelarPedido)
    }
    
    search(filter: PedidoFilterInterface): Observable<PedidoInterface[]> {
        return this.http.post<any>(this.baseUrl + 'search', filter)
    }
    
}