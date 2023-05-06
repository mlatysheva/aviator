import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {

  constructor(
    private authService: AuthService, 
    private router: Router,
  ) {}

  canActivate(): Observable<boolean | UrlTree> | boolean {
    return this.authService.isAuth$.pipe(
      map((isAuth) => isAuth || this.router.createUrlTree([{ outlets: { modal: 'auth' } }])),
    );
  }
}