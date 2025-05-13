import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ErrorMessagePipe } from './pipes/error-message.pipe';
import { SessionExpiredComponent } from './components/session-expired/session-expired.component';
import { FloatCartButtonComponent } from './components/float-cart-button/float-cart-button.component';



@NgModule({
  declarations: [
    ErrorMessagePipe,
    SessionExpiredComponent,
    FloatCartButtonComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports:[
    ErrorMessagePipe,
    FloatCartButtonComponent,
  ]
})
export class SharedModule { }
