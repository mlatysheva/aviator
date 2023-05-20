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
  USER_ID,
  USER_NAME,
} from '../../../constants/localStorage';
import { Subscription } from 'rxjs';
import { AviaService } from 'src/app/avia/services/avia.service';
import { CartApiService } from '../../../cart/services/cart-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  public userName = localStorage.getItem(USER_NAME) || '';
  userId = localStorage.getItem(USER_ID) || '';
  isAuth = false;
  cartCount: number | undefined;

  authSubscription: Subscription = new Subscription();
  cartSubscription: Subscription = new Subscription();
  editModeSubscription: Subscription = new Subscription();

  selectedCurrency = localStorage.getItem(CURRENCY) || 'EUR';
  selectedDateFormat = localStorage.getItem(DATE_FORMAT) || 'DD/MM/YYYY';

  public changeStyle = false;

  constructor(
    private authService: AuthService,
    private aviaService: AviaService,
    private store: Store,
    private cartService: CartApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isAuth$.subscribe((isAuth) => {
      this.isAuth = isAuth;
      if (isAuth) {
        this.userName = localStorage.getItem(USER_NAME) || '';
      }
    });

    this.cartSubscription = this.cartService.cartCount$.subscribe(
      (cartCount) => (this.cartCount = cartCount)
    );

    this.aviaService.changeHeaderStyle$.subscribe(
      (changeStyle) => (this.changeStyle = changeStyle)
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

  toUserAccount() {
    this.router.navigate(['account']);
  }

  ngOnDestroy() {
    this.aviaService.changeHeaderStyle$.unsubscribe();
    this.authService.isAuth$.unsubscribe();
  }
}
