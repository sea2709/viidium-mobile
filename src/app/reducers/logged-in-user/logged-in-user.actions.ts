import {Action} from '@ngrx/store';
import {User} from '../../models/user.model';

export const SET_LOGGED_IN_USER = '[Logged In User] Set Logged In User';
export class SetLoggedInUser implements Action {
    readonly type = SET_LOGGED_IN_USER;

    constructor(public payload: User) {
    }
}

export type Actions = SetLoggedInUser;