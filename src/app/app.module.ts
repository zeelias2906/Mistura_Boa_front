import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AdminLayoutComponent } from './core/components/admin-layout/admin-layout.component';
import { PublicLayoutComponent } from './core/components/public-layout/public-layout.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { SharedModule } from './shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SucessModalComponent } from './core/components/modals/sucess/sucess-modal.component';
import { ErrorModalComponent } from './core/components/modals/error/error-modal.component';
import { ConfirmModalComponent } from './core/components/modals/confirm/confirm-modal/confirm-modal.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptor/auth.interceptor';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    PublicLayoutComponent,
    AdminLayoutComponent,
    HeaderComponent,
    FooterComponent,
    SucessModalComponent,
    ErrorModalComponent,
    ConfirmModalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    SharedModule,
    NgbModule,
    FormsModule,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
    // provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
