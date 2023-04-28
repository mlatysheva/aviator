import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, catchError, of, concatMap } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { setUserProfile, setUserProfileFailure, setUserProfileSuccess } from '../actions/user.actions';
import { IUser } from '../../models';
import { errors } from '../../constants/errors';

@Injectable()
export class UserEffects {

  constructor(
    private actions$: Actions,
    private authService: AuthService,    
  ) {}
  
  loadUserProfile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(setUserProfile),
      concatMap(({ email, password }) => this.authService.onLogin(email, password).pipe(
        map((userProfile: IUser) => setUserProfileSuccess({ userProfile })),
        catchError(() =>
          of(
            setUserProfileFailure({
              error: errors.USER_PROFILE_LOAD_FAILURE,
            }),
          )
        ),
      )),        
    );
  });
}
