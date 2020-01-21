import * as ExcludeArticleIdsActions from './exclude-article-ids.actions';

export function excludeArticleIdsReducer(state: number[], action: ExcludeArticleIdsActions.Actions): number[] {
    switch (action.type) {
        case ExcludeArticleIdsActions.SET_EXCLUDE_ARTICLE_IDS:
            return action.payload;
        default:
            return state;
    }
}