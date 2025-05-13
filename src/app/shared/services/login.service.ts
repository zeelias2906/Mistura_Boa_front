import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  redirectUrl!: string;

  constructor(private router: Router) {}

  redirectToLogin() {
    this.redirectUrl = this.router.routerState.snapshot.url;
    this.router.navigate(['/login']);
  }

  redirectAfterLogin() {
    if (this.redirectUrl) {
      this.router.navigateByUrl(this.redirectUrl);
      this.redirectUrl = '';
      return;
    }

    this.router.navigate([''])


  }
}
