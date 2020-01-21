// admin-guard.service.ts
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {CanActivate} from '@angular/router';
import {AuthService} from './auth.service';
import { UserService } from './user.service';
import { Observable } from 'rxjs';

@Injectable()
export class AdminAuthGuard implements CanActivate {

    constructor(private _authService: AuthService, private _userService: UserService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this._authService.isLoggedIn()) {
            return Observable.create(observer => {
                this._userService.getLoggedInUser().subscribe(user => {
                    if (user) {
                        observer.next(user.roles.indexOf('administrator') > -1);
                    } else {
                        observer.next(false);
                    }
                    observer.complete();
                });
            });
        } else {
            this.router.navigate(['/']);
            return false;
        }
    }
}