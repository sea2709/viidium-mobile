import {Action} from '@ngrx/store';

export const SET_CURRENT_PAGE = '[Current Page] Set Current Page';
export class SetCurrentPage implements Action {
    readonly type = SET_CURRENT_PAGE;

    constructor(public payload: string) {
    }
}

export type Actions = SetCurrentPage;