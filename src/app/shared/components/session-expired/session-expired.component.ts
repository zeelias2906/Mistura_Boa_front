import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorModalComponent } from '../../../core/components/modals/error/error-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-expired',
  templateUrl: './session-expired.component.html',
  styleUrl: './session-expired.component.scss'
})
export class SessionExpiredComponent {
  
  constructor(private modalService: NgbModal, private router: Router) {
    const modalRef = this.modalService.open(ErrorModalComponent, {
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.message = 'Sessão expirada. Faça login novamente.';

    modalRef.result.finally(() => {
      this.router.navigate(['/login']); // ou qualquer rota apropriada
    });
  }

}
