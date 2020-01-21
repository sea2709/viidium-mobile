import {Action} from '@ngrx/store';
import {User} from '../../models/user.model';

export const SET_VIEWED_USER = '[Viewed User] Set Viewed User';
export class SetViewedUser implements Action {
    readonly type = SET_VIEWED_USER;

    constructor(public payload: User) {
    }
}

export type Actions = SetViewedUser;