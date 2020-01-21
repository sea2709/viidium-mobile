import * as LoggedInUserActions from './logged-in-user.actions';

import {User} from '../../models/user.model';

export function loggedInUserReducer(state: User, action: LoggedInUserActions.Actions): User {
    switch (action.type) {
        case LoggedInUserActions.SET_LOGGED_IN_USER:
            return action.payload;
        default:
            return state;
    }
}