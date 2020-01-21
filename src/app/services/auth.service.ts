import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {JwtHelper} from '../helpers/jwt.helper';
import {SettingService} from './setting.service';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/shareReplay';
import {Observable} from 'rxjs';

declare let moment: any;

@Injectable()
export class AuthService {
    constructor(private _settingService: SettingService, private _http: HttpClient, private _jwtHelper: JwtHelper) {
    }

    public setSession(token: string) {
        const expiresAt = moment.unix(this._jwtHelper.getTokenExpirationDate(token));
        const uid = this._jwtHelper.getUId(token);
        localStorage.setItem('id_token', token);
        localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
        localStorage.setItem('uid', uid.toString());
    }

    login(name: string, password: string) {
        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Basic ' + btoa(name + ':' + password));
        headers = headers.append('Content-Type', 'application/json');
        return this._http.post(this._settingService.getApiUrl() + '/jwt/token', null, {headers: headers}).do(
            (res: { token: string }) => {
                this.setSession(<string>res.token);
            }
        ).shareReplay();
    }

    logout(): void {
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        localStorage.removeItem('uid');
    }

    isLoggedIn(): boolean {
        return moment().isBefore(this.getExpiration());
    }

    isLoggedOut(): boolean {
        return !this.isLoggedIn();
    }

    getExpiration() {
        const expiration = localStorage.getItem('expires_at');
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }

    getUid(): string {
        return localStorage.getItem('uid');
    }

    getSessionToken(): Observable<string> {
        return this._http.get(this._settingService.getApiUrl() + '/session/token', {responseType: 'text'})
            .map(response => response.toString());
    }
}
