import {Component, OnInit} from '@angular/core';
import {MetaService} from '../../services/meta.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../reducers/app-state-reducer';
import {VideoService} from '../../services/video.service';
import {VideoPlayerService} from '../../services/video-player.service';
import {StringUtilities} from '../../utilities/string';
import {Video} from '../../models/video.model';

import * as TopMenuActions from '../../reducers/top-menu/top-menu.actions';
import * as CurrentPageActions from '../../reducers/current-page/current-page.actions';
import { HeaderService } from 'app/services/header.service';

declare let jQuery: any;

@Component({
    selector: 'videos-page',
    templateUrl: './videos-page.component.html',
    styleUrls: ['./videos-page.component.scss']
})

export class VideosPageComponent implements OnInit {
    private _pageNumber = 1;
    private _videosPerPage = 20;
    private _total: number;

    public videos: Video[] = [];
    public isLoading = true;

    constructor(private _metaService: MetaService, private _store: Store<AppState>,
                private _videoService: VideoService, public videoPlayerService: VideoPlayerService,
                public stringUtilities: StringUtilities, public headerService: HeaderService) {
        this._store.dispatch(new TopMenuActions.SetTopMenuStyle('transparent'));
        this._store.dispatch(new CurrentPageActions.SetCurrentPage('videos'));
    }

    private _loadVideos(): void {
        this._videoService.getLatestVideos(0, this._pageNumber, this._videosPerPage).subscribe({
            next: response => {
                for (let video of response.videos) {
                    this.videos.push(video);
                }
                this._total = response.total;
            }
        })
    }

    ngOnInit(): void {
        this._metaService.setTitle('Videos');
        this._loadVideos();
    }

    onScrollDown(): void {
        this.loadMore();
    }

    loadMore(): void {
        this._pageNumber++;

        if (this.videos.length < this._total) {
            this.isLoading = true;
            this._loadVideos();
        }
    }
}