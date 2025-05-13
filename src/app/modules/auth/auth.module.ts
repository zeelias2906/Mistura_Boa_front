import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthenticationStore } from './stores/authentication-store';
import { LoginComponent } from './views/login/login.component';
import { NewUserComponent } from './views/new-user/new-user.component';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [
    LoginComponent,
    NewUserComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxSpinnerModule,
  ],
  providers:[
    provideHttpClient(withFetch()),
    AuthenticationStore,
    provideNgxMask()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthModule { }
