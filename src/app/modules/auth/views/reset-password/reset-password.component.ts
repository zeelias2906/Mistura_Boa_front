import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationStore } from '../../stores/authentication-store';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  form = {} as FormGroup;
  visible = false;
  messageError: string = '';

  constructor(private formBuilder: FormBuilder, private route: Router, private authenticationStore: AuthenticationStore, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.visible = false;
    this.form = this.formBuilder.group({
      nome: new FormControl(null, Validators.required),
      cpf: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      novaSenha: new FormControl(null, Validators.required)
    });
  }


  redefinirSenha() {
    this.messageError = ''
    if(this.form.get('emailUsuario')?.errors?.['email']){
      this.messageError = 'E-mail informado não é válido!'
      return
    }else if (this.form.invalid) {
      this.messageError = 'Por Favor preencha todos os campos!'
      return;
    }

    this.spinner.show()
    this.authenticationStore.resetPassword(this.form.value).subscribe({
      next: (data: any) => {
        this._redirectTo()
        this.spinner.hide()
      },
      error: (error: any) => {
        this.messageError = error?.error?.message || 'Ocorreu um erro inesperado.';
        this.spinner.hide()
      }
    });
  }

  criarConta() {
    this.route.navigate(['/login/new-user'])
  }

  private _redirectTo() {
    this.route.navigate(['/login'])
  }

  changeVisibility() {
    this.visible = !this.visible;
  }

}

