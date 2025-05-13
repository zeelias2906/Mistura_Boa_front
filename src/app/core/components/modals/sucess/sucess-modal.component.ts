import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sucess-modal',
  templateUrl: './sucess-modal.component.html',
  styleUrl: './sucess-modal.component.scss'
})
export class SucessModalComponent {
  
  constructor(private activeModal: NgbActiveModal){}

	@Input() message: string = ''

  confirm() {
    this.activeModal.close()
  }
  
}

