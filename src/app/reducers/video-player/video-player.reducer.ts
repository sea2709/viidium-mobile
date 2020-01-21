import {SafeHtml} from '@angular/platform-browser';
import * as VideoPlayerActions from './video-player.actions'

export interface VideoPlayerState {
    isPlayerActive: boolean,
    videoPlayerHtml: SafeHtml
}

const initialState: VideoPlayerState = {
    isPlayerActive: false,
    videoPlayerHtml: null
}

export function videoPlayerReducer(state: VideoPlayerState = initialState, action: VideoPlayerActions.Actions): VideoPlayerState {
    switch (action.type) {
        case VideoPlayerActions.SHOW_VIDEO_PLAYER:
            return {
                ...state,
                isPlayerActive: true,
                videoPlayerHtml: action.payload
            };
        case VideoPlayerActions.CLOSE_VIDEO_PLAYER:
            return {
                ...state,
                isPlayerActive: false
            };
        default:
            return state;
    }
}