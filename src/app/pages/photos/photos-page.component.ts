import {Component, OnInit} from '@angular/core';
import {MetaService} from '../../services/meta.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../reducers/app-state-reducer';
import {PhotoService} from '../../services/photo.service';
import {PhotoSet} from '../../models/photoset.model';

import * as TopMenuActions from '../../reducers/top-menu/top-menu.actions';
import * as CurrentPageActions from '../../reducers/current-page/current-page.actions';
import { HeaderService } from 'app/services/header.service';

declare let jQuery: any;

@Component({
    selector: 'photos',
    templateUrl: './photos-page.component.html',
    styleUrls: ['./photos-page.component.scss']
})

export class PhotosPageComponent implements OnInit  {
    private _pageNumber = 1;
    private _photosPerPage = 10;
    private _total: number;

    public photoSets: PhotoSet[] = [];
    public isLoading = true;

    constructor(private _metaService: MetaService, private _store: Store<AppState>, 
        private _photoService: PhotoService, public headerService: HeaderService) {
        this._store.dispatch(new TopMenuActions.SetTopMenuStyle('transparent'));
        this._store.dispatch(new CurrentPageActions.SetCurrentPage('photos'));
    }

    ngOnInit(): void {
        this._metaService.setTitle('Photos');
        this.loadPhotos();
    }

    onScrollDown() {
        this.loadMore();
    }

    loadMore(): void {
        this._pageNumber++;

        if (this.photoSets.length < this._total) {
            this.isLoading = true;
            this.loadPhotos();
        }
    }

    loadPhotos(): void {
        this._photoService.getLatestPhotoSets((this._pageNumber - 1) * this._photosPerPage, this._photosPerPage).subscribe({
            next: response => {
                this._total = response.total;
                for (let photoSet of response.photoSets) {
                    this.photoSets.push(photoSet);
                }

                setTimeout(() => {
                    const secondPhoto = jQuery('.vi-photo:not(.vi-first)').first();
                    if(secondPhoto.length > 0) {
                        const offset = secondPhoto.find('.vi-name').offset();
                        const firstPhoto = jQuery('.vi-photo.vi-first');
                        firstPhoto.find('.vi-name').css({bottom: offset.top + 'px'});
                    }
                    
                });
            }
        });
    }
}