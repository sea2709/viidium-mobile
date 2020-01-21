import {Action} from '@ngrx/store';

export const SET_EXCLUDE_ARTICLE_IDS = '[Exclude Article Ids] Set Exclude Article Ids';
export class SetExcludeArticleIds implements Action {
    readonly type = SET_EXCLUDE_ARTICLE_IDS ;

    constructor(public payload: number[]) {
    }
}

export type Actions = SetExcludeArticleIds;