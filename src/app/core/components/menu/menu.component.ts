import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/auth/services/auth.service';
import { setCurrency, setDateFormat } from '../../../store/actions/user.actions';
import { CURRENCY, DATE_FORMAT } from '../../../constants/localStorage';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnDestroy {
  public isVisible = false;

  selectedCurrency = localStorage.getItem(CURRENCY) || 'EUR';
  selectedDateFormat = localStorage.getItem(DATE_FORMAT) || 'DD/MM/YYYY';

  constructor(
    private authService: AuthService,
    private store: Store,
  ) {}

  public toggleSignInModal() {
    this.authService.isVisible$.subscribe(
      (showModal) => (this.isVisible = showModal)
    );
    this.authService.isVisible$.next(!this.isVisible);
  }

  setUserCurrency(currency: string) {
    this.store.dispatch(setCurrency({ currency }));
    localStorage.setItem(CURRENCY, currency);
  }

  setDateFormat(dateFormat: string) {
    this.store.dispatch(setDateFormat({ dateFormat }));
    localStorage.setItem(DATE_FORMAT, dateFormat);
  }

  ngOnDestroy() {
    this.authService.isVisible$.unsubscribe();
  }
}
