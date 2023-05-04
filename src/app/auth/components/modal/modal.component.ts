import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Output() modalClose: EventEmitter<any> = new EventEmitter();

  // isVisible = false;
  
  constructor(
    // public authService: AuthService,
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

  // public toggleSignInModal() {
  //   this.authService.isVisible$.subscribe(
  //     (showModal) => (this.isVisible = showModal)
  //   );
  //   this.authService.isVisible$.next(!this.isVisible);
  // }
}
