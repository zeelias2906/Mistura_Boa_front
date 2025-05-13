import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationStore } from '../../stores/authentication-store';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.scss'
})
export class NewUserComponent implements OnInit {
  form = {} as FormGroup;
  visible = false;
  messageError: string = '';

  constructor(private formBuilder: FormBuilder, private route: Router, private authenticationStore: AuthenticationStore, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.visible = false;
    this.form = this.formBuilder.group({
      nomeUsuario: new FormControl(null, Validators.required),
      dataNascimento: new FormControl(null, Validators.required),
      cpf: new FormControl(null, Validators.required),
      telefone: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      senha: new FormControl(null, Validators.required)
    });
  }


  redefinirSenha() {
    this.messageError = ''
    if(this.form.get('email')?.errors?.['email']){
      this.messageError = 'E-mail informado não é válido!'
      return
    }else if (this.form.invalid) {
      this.messageError = 'Por Favor preencha todos os campos!'
      return;
    }

    this.spinner.show()
    this.authenticationStore.newUser(this._normalizeFields()).subscribe({
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
  private _normalizeFields(): any {
    let rawValue = this.form.getRawValue()
    return {
      email: rawValue.email,
      senha: rawValue.senha,
      pessoa: {
        nome: rawValue.nomeUsuario,
        cpf: rawValue.cpf,
        dataNascimento: rawValue.dataNascimento,
        telefone: rawValue.telefone
      }
    }
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
