import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {VideoPlayerService} from './services/video-player.service';
import {VideoPlayerState} from './reducers/video-player/video-player.reducer';
import {Observable} from 'rxjs/Observable';
import {AppState} from './reducers/app-state-reducer';
import { Router, NavigationEnd } from '@angular/router';

declare let FB: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent {

    title = 'viidium-app';
    topMenuStyle$: Observable<string> = null;
    videoPlayer$: Observable<VideoPlayerState> = null;
    currentPage$: Observable<string> = null;

    constructor(private _store: Store<AppState>,
                public videoPlayerService: VideoPlayerService,
                private _router: Router) {
        this.videoPlayer$ = this._store.select(state => state.videoPlayer);
        this.topMenuStyle$ = this._store.select(state => state.topMenuStyle);
        this.currentPage$ = this._store.select(state => state.currentPage);

        this.videoPlayer$.subscribe({
            next: response => {
                if (response.isPlayerActive) {
                    setTimeout(() => {
                        FB.XFBML.parse(document.getElementById('vi-video-player'));
                    });
                }
            }
        });

        this._router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });
    }
}
