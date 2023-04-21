import { Component, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnDestroy {
  public isVisible = false;

  constructor(private authService: AuthService) {}

  public toggleSignInModal() {
    this.authService.isVisible$.subscribe(
      (showModal) => (this.isVisible = showModal)
    );
    this.authService.isVisible$.next(!this.isVisible);
  }

  ngOnDestroy() {
    this.authService.isVisible$.unsubscribe();
  }
}
