import * as CurrentPageActions from './current-page.actions';

export function currentPageReducer(state: string, action: CurrentPageActions.Actions): string {
    switch (action.type) {
        case CurrentPageActions.SET_CURRENT_PAGE:
            return action.payload;
        default:
            return state;
    }
}