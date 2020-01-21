import {videoPlayerReducer, VideoPlayerState} from './video-player/video-player.reducer';
import {ActionReducerMap} from '@ngrx/store';
import {topMenuReducer} from './top-menu/top-menu.reducer';
import {excludeArticleIdsReducer} from './exclude-article-ids/exclude-article-ids.reducer';
import {currentPageReducer} from './current-page/current-page.reducer';
import {User} from '../models/user.model';
import {loggedInUserReducer} from './logged-in-user/logged-in-user.reducer';
import {viewedUserReducer} from './viewed-user/viewed-user.reducer';

export interface AppState {
    currentPage: string;
    videoPlayer: VideoPlayerState;
    topMenuStyle: string;
    excludeArticleIds: number[];
    loggedInUser: User;
    viewedUser: User;
}

export const appStateReducer: ActionReducerMap<AppState> = {
    currentPage: currentPageReducer,
    videoPlayer: videoPlayerReducer,
    topMenuStyle: topMenuReducer,
    excludeArticleIds: excludeArticleIdsReducer,
    loggedInUser: loggedInUserReducer,
    viewedUser: viewedUserReducer
};
