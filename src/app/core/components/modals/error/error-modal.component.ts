import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrl: './error-modal.component.scss'
})
export class ErrorModalComponent {

  constructor(private activeModal: NgbActiveModal){}

  @Input() message: string = ''

  confirm() {
    this.activeModal.close()
  }
  
}
