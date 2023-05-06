import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
  setCurrency,
  setDateFormat,
} from '../../../store/actions/user.actions';
import {
  CURRENCY,
  DATE_FORMAT,
  USER_EMAIL,
  USER_NAME,
} from '../../../constants/localStorage';
import { Subscription } from 'rxjs';
import { AviaService } from 'src/app/avia/services/avia.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  public isVisible = false;
  public userName = localStorage.getItem(USER_NAME) || '';
  isAuth = false;

  authSubscription: Subscription = new Subscription();

  selectedCurrency = localStorage.getItem(CURRENCY) || 'EUR';
  selectedDateFormat = localStorage.getItem(DATE_FORMAT) || 'DD/MM/YYYY';

  public isSubmitted = false;

  constructor(
    private authService: AuthService,
    private aviaService: AviaService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isAuth$.subscribe(
      (isAuth) => {
        this.isAuth = isAuth;
        if (isAuth) {
          this.userName =
            localStorage.getItem(USER_NAME) || '';
            console.log(`in menu this.userName: ${this.userName}`);
        }
      }
    );
    this.aviaService.isSearchSubmitted$.subscribe(
      (isSubmitted) => (this.isSubmitted = isSubmitted)
    );
  }

  setUserCurrency(currency: string) {
    this.store.dispatch(setCurrency({ currency }));
    localStorage.setItem(CURRENCY, currency);
  }

  setDateFormat(dateFormat: string) {
    this.store.dispatch(setDateFormat({ dateFormat }));
    localStorage.setItem(DATE_FORMAT, dateFormat);
  }

  onLogout() {
    this.authService.onLogout();
  }

  ngOnDestroy() {
    this.aviaService.isSearchSubmitted$.unsubscribe();
    this.authService.isAuth$.unsubscribe();
  }
}
