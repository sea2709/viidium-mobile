import * as TopMenuActions from './top-menu.actions';

export function topMenuReducer(state: string, action: TopMenuActions.Actions): string {
    switch (action.type) {
        case TopMenuActions.SET_TOP_MENU_STYLE:
            return action.payload;
        default:
            return state;
    }
}