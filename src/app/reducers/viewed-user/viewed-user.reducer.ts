import * as ViewedUserActions from './viewed-user.actions';

import {User} from '../../models/user.model';

export function viewedUserReducer(state: User, action: ViewedUserActions.Actions): User {
    switch (action.type) {
        case ViewedUserActions.SET_VIEWED_USER:
            return action.payload;
        default:
            return state;
    }
}