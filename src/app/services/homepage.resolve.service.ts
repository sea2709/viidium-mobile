import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {GroupService} from './group.service';
import {Observable} from 'rxjs';
import {Group} from '../models/group.model';
import { SettingService } from './setting.service';

@Injectable()
export class HomepageResolve implements Resolve<Group[]> {
    constructor(private _groupService: GroupService, private _settingService: SettingService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Group[]> {
        return this._groupService.getGroups([this._settingService.configurations['featured_group']]);
    }
}