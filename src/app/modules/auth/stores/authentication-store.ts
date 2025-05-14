import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable()
export class AuthenticationStore {

  private readonly baseUrl = `${environment.apiUrl}auth/`

  constructor(private http: HttpClient) { }

  login(loginModel: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'login', loginModel)
  }

  resetPassword(resetPassword: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'reset-password', resetPassword)
  }

  newUser(newUser: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'new-user', newUser)
  }

}
