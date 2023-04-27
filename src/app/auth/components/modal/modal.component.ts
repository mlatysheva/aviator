import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  isVisible = false;
  
  constructor(public authService: AuthService) {}

  public toggleSignInModal() {
    console.log('toggleSignInModal');
    this.authService.isVisible$.subscribe(
      (showModal) => (this.isVisible = showModal)
    );
    this.authService.isVisible$.next(!this.isVisible);
  }
}
