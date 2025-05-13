import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationStore } from '../../stores/authentication-store';
import { LoginService } from '../../../../shared/services/login.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  form = {} as FormGroup;
  visible = false;
  messageError: string = '';
  

  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    private spinner: NgxSpinnerService,
    private authenticationStore: AuthenticationStore,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
      localStorage.removeItem('token');
    }
    this.visible = false;
    this.form = this.formBuilder.group({
      email: new FormControl(null, [Validators.required]),
      senha: new FormControl(null, Validators.required),
    });
  }

  logar() {
    this.messageError = '';
    if (this.form.get('email')?.errors?.['email']) {
      this.messageError = 'E-mail informado não é válido!';
      return;
    } else if (this.form.invalid) {
      this.messageError = 'Por Favor preencha todos os campos!';
      return;
    }

    this.spinner.show()
    this.authenticationStore.login(this.form.value).subscribe({
      next: (data: any) => {
        localStorage.setItem('token', data.token);
        this._redirectTo();
        this.spinner.hide()
      },
      error: (error: any) => {
        this.messageError = error?.error?.message || 'Ocorreu um erro inesperado.';
        this.spinner.hide()
      },
    });
  }

  criarConta() {
    this.route.navigate(['/login/new-user']);
  }

  private _redirectTo() {
    this.loginService.redirectAfterLogin();
  }

  changeVisibility() {
    this.visible = !this.visible;
  }

}
