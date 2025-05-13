import { Pipe, PipeTransform } from '@angular/core'
import { AbstractControl, FormGroup } from '@angular/forms'
import { Observable, combineLatest, map, startWith } from 'rxjs'

@Pipe({
  name: 'errorMessage',
})
export class ErrorMessagePipe implements PipeTransform {
  transform(form: FormGroup | AbstractControl, fieldIdentifier: string): Observable<string> {
    return combineLatest([
      form.get(fieldIdentifier)!.valueChanges.pipe(startWith(form.get(fieldIdentifier)?.value)),
      form.get(fieldIdentifier)!.statusChanges.pipe(startWith(form.get(fieldIdentifier)?.status)),
    ]).pipe(map(() => this._setErrorMessage(form, fieldIdentifier)))
  }

  private _setErrorMessage(form: FormGroup | AbstractControl, fieldIdentifier: string): string {
    if (form.get(fieldIdentifier)?.touched && !form.get(fieldIdentifier)?.valid) {
      const controlErrors = form.get(fieldIdentifier)?.errors
      if (controlErrors) {
        if (controlErrors['required']) {
          return 'Campo de preenchimento obrigatório'
        }
        if (controlErrors['cpf']) {
          return 'O CPF informado é inválido'
        }
        if (controlErrors['cpfJaExiste']) {
          return 'Cpf informado já existe no sistema'
        }
        if (controlErrors['emailJaExiste']) {
          return 'Email informado já existe no sistema'
        }
        if (controlErrors['email']) {
          return 'O Email informado é inválido'
        }
        if (controlErrors['date']) {
          return 'A data informada não pode ser maior que a data atual'
        }
        if (controlErrors['phone']) {
          return 'O telefone informado é inválido'
        }
        if (controlErrors['cnpj']) {
          return 'O CNPJ informado é inválido'
        }
        if (controlErrors['maxlength']) {
          return 'O tamanho do campo atingiu o limite máximo'
        }
        if (controlErrors['minlength']) {
          return 'O campo requer um tamanho mínimo'
        }
        if (controlErrors['cep']) {
          return 'O CEP informado é inválido'
        }
        if (controlErrors['tagInvalid']) {
          return 'Tag informada é inválida'
        }
      }
    }
    return ''
  }
}