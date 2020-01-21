// editor-auth-guard.service.ts
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {CanActivate} from '@angular/router';
import {AuthService} from './auth.service';
import {UserService} from './user.service';
import {User} from '../models/user.model';
import {map} from 'rxjs/operators';

@Injectable()
export class EditorAuthGuard implements CanActivate {

    constructor(private _authService: AuthService, private _userService: UserService, private _router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this._authService.isLoggedIn()) {
            return this._userService.getLoggedInUser().pipe(map(
                (user: User) => {
                    if (user === null) {
                        return false;
                    } else {
                        return user.roles.indexOf('editorial_board') > -1;
                    }
                }
            ));
        } else {
            this._router.navigate(['/']);
            return false;
        }
    }
}