import { Injectable } from '@angular/core';
import {Store} from '@ngrx/store';
import {SafeHtml} from '@angular/platform-browser';
import * as VideoPlayerActions from '../reducers/video-player/video-player.actions';
import {AppState} from '../reducers/app-state-reducer';

@Injectable()
export class VideoPlayerService {
    constructor(private store: Store<AppState>) {}

    showVideoPlayer(html: SafeHtml) {
        this.store.dispatch(new VideoPlayerActions.ShowVideoPlayer(html));
    }

    closeVideoPlayer() {
        this.store.dispatch(new VideoPlayerActions.CloseVideoPlayer());
    }
}
