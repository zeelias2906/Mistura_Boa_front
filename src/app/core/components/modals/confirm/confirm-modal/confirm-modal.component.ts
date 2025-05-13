import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {

    constructor(private activeModal: NgbActiveModal){}
  
    @Input() message: string = ''
  
    confirm() {
      this.activeModal.close()
    }
    cancel() {
      this.activeModal.dismiss()
    }

}
