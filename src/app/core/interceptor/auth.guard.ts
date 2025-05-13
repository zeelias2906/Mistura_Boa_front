import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthTokenService } from "../../shared/services/auth-token.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private auth: AuthTokenService, 
        private router: Router,
    ) {}


    canActivate(): boolean {
        if (this.auth.isTokenValid()) {
            return true;
        } else {
            this.router.navigate(['/session-expired']);
            return false;
        }
    }

}
