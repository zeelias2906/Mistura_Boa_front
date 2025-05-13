import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthTokenService } from '../../shared/services/auth-token.service';
  
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private authService: AuthTokenService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `${token}` }
      });
    }

    return next.handle(request);
  }
}
  

  