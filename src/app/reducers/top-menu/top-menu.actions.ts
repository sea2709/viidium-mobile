import {Action} from '@ngrx/store';

export const SET_TOP_MENU_STYLE = '[Top Menu] Set Style';
export class SetTopMenuStyle implements Action {
    readonly type = SET_TOP_MENU_STYLE;

    constructor(public payload: string) {
    }
}

export type Actions = SetTopMenuStyle;