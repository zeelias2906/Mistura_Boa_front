import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { CarrinhoInterface } from "../models/carrinho.interface";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root', 
})
export class CarrinhoStore {

    private readonly baseUrl = `${environment.apiUrl}carrinho/`


    constructor(private http: HttpClient) { }

    save(carrinho: CarrinhoInterface): Observable<CarrinhoInterface> {
        return this.http.post<any>(this.baseUrl, carrinho)
    }
    
    getByIdUsaurio(idUsuario: number): Observable<CarrinhoInterface> {
        return this.http.get<any>(this.baseUrl + 'by-usuario/' + idUsuario)
    }
    
    getById(id: number): Observable<CarrinhoInterface> {
        return this.http.get<any>(this.baseUrl + id)
    }

    delete(idCarrinho: number, idProdutoCarrinho: number): Observable<CarrinhoInterface> {
        return this.http.delete<any>(this.baseUrl + 'remove-product/' + idCarrinho + '/' + idProdutoCarrinho)
    }
    
}