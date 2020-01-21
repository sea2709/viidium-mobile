import {Action} from '@ngrx/store';
import {SafeHtml} from '@angular/platform-browser';

export const SHOW_VIDEO_PLAYER = '[Video Player] Show Video Player';
export class ShowVideoPlayer implements Action {
    readonly type = SHOW_VIDEO_PLAYER;
    constructor(public payload: SafeHtml) {}
}

export const CLOSE_VIDEO_PLAYER = '[Video Player] Close Video Player';
export class CloseVideoPlayer implements Action {
    readonly type = CLOSE_VIDEO_PLAYER;
}

export type Actions = ShowVideoPlayer | CloseVideoPlayer;