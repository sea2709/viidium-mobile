// auth-guard.service.ts
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {CanActivate} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable()
export class GuestAuthGuard implements CanActivate {

    constructor(private _authService: AuthService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this._authService.isLoggedIn()) {
            return true;
        } else {
            this.router.navigate(['/']);
            return false;
        }
    }
}