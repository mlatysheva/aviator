import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/auth/services/auth.service';
import { setCurrency, setDateFormat } from '../../../store/actions/user.actions';
import { CURRENCY, DATE_FORMAT, USER_EMAIL, USER_NAME } from '../../../constants/localStorage';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  public isVisible = false;
  public userName = localStorage.getItem('userName') || '';
  isAuth = false;

  authSubscription: Subscription = new Subscription();

  selectedCurrency = localStorage.getItem(CURRENCY) || 'EUR';
  selectedDateFormat = localStorage.getItem(DATE_FORMAT) || 'DD/MM/YYYY';

  constructor(
    private authService: AuthService,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.setUserName();
    this.authSubscription = this.authService.isAuth$.subscribe((isAuth) => this.isAuth = isAuth);
    this.userName = localStorage.getItem(USER_NAME) || localStorage.getItem(USER_EMAIL) || '';
    console.log('this.isAuth', this.isAuth);
  }
  
  public toggleSignInModal() {
    this.authService.isVisible$.subscribe(
      (showModal) => (this.isVisible = showModal)
    );
    this.authService.isVisible$.next(!this.isVisible);
  }

  public setUserName() {
    this.authService.isAuth$.subscribe((isAuth) => {
      if (isAuth) {
        this.userName = localStorage.getItem(USER_NAME) || localStorage.getItem(USER_EMAIL) || '';
        this.isAuth = isAuth;
      }
    });
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
    this.authService.isVisible$.unsubscribe();
  }
}
