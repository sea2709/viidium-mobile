import {Component, OnInit, ViewChild, ElementRef, Inject} from '@angular/core';
import {MetaService} from '../../services/meta.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../reducers/app-state-reducer';
import {PhotoService} from '../../services/photo.service';
import {PhotoSet} from '../../models/photoset.model';
import {ActivatedRoute} from '@angular/router';
import {DOCUMENT} from '@angular/common';

import * as TopMenuActions from '../../reducers/top-menu/top-menu.actions';
import * as CurrentPageActions from '../../reducers/current-page/current-page.actions';

declare let jQuery: any;

@Component({
    selector: 'photo-set',
    templateUrl: './photo-set-page.component.html',
    styleUrls: ['./photo-set-page.component.scss']
})

export class PhotoSetPageComponent implements OnInit {
    private _photoSetId: number;
    public photoSet: PhotoSet;
    public prevPhotoSet: PhotoSet;
    public nextPhotoSet: PhotoSet;

    @ViewChild('gallery')
    private _gallery: ElementRef;

    constructor(private _metaService: MetaService, private _store: Store<AppState>, private _photoService: PhotoService,
                private _route: ActivatedRoute, @Inject(DOCUMENT) public doc: Document) {
        this._store.dispatch(new TopMenuActions.SetTopMenuStyle('normal'));
        this._store.dispatch(new CurrentPageActions.SetCurrentPage('photo-set'));
    }

    ngOnInit(): void {
        this._route.params.subscribe(params => {
            this._photoSetId = +params['photoSetId'];

            this.prevPhotoSet = null;
            this.nextPhotoSet = null;

            this._photoService.getPhotoSetById(this._photoSetId).subscribe({
                next: photoSet => {
                    this.photoSet = photoSet;
                    console.log(this.photoSet);
                    setTimeout(() => {
                        if (this._gallery.nativeElement) {
                            jQuery(this._gallery.nativeElement).unitegallery({
                                tiles_type: 'justified'
                            });
                        }
                    });

                    this._metaService.setTitle(this.photoSet.name);
                    this._metaService.setTag('og:url', location.href);

                    if (this.photoSet.photos && this.photoSet.photos.length > 0) {
                        this._metaService.setTag('og:image', this.photoSet.photos[0].src);
                    }

                    this._photoService.getPrevAndNextPhotoSet(this._photoSetId).subscribe({
                        next: data => {
                            if (data.prev) {
                                this.prevPhotoSet = data.prev;
                            }
                            if (data.next) {
                                this.nextPhotoSet = data.next;
                            }
                        }
                    })
                }
            });
        });
    }
}