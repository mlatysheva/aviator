import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Output() modalClose: EventEmitter<any> = new EventEmitter();
  
  constructor(
    private router: Router,
    ) {}

  closeModal($event: any) {
    this.router.navigate([{ outlets: { modal: null } }]);
    this.modalClose.next($event);
  }

  closeModalOverlay($event: any) {
    if ($event.target.classList.contains("auth-modal-overlay")) {
      this.router.navigate([{ outlets: { modal: null } }]);
      this.modalClose.next($event);
    }
  }
}
