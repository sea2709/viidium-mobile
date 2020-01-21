import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {MetaService} from '../../services/meta.service';
import {Collection} from '../../models/collection.model';
import {Store} from '@ngrx/store';
import {AppState} from '../../reducers/app-state-reducer';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

import * as CurrentPageActions from '../../reducers/current-page/current-page.actions';
import * as TopMenuActions from '../../reducers/top-menu/top-menu.actions';
import { HeaderService } from 'app/services/header.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CollectionService } from 'app/services/collection.service';
import { User } from 'app/models/user.model';
import { UserService } from 'app/services/user.service';

@Component({
    selector: 'collections-page',
    templateUrl: './collections-page.component.html',
    styleUrls: ['./collections-page.component.scss']
})

export class CollectionsPageComponent implements OnInit {
    public collections: Collection[] = [];
    public loggedInUser: User;

    public collectionWidth: number;
    public collectionForm: FormGroup;

    public newCollectionModalRef: BsModalRef;

    public selectedView: string = 'thumbnail';

    @ViewChild('newCollectionModal')
    newCollectionModal: ElementRef;

    constructor(private _metaService: MetaService, private _store: Store<AppState>, private _userService: UserService,
        public headerService: HeaderService, private _modalService: BsModalService, private _collectionService: CollectionService) {
        this._store.dispatch(new TopMenuActions.SetTopMenuStyle('transparent'));
        this._store.dispatch(new CurrentPageActions.SetCurrentPage('collection'));

        this._metaService.setTitle('Collections');
    }

    ngOnInit(): void {
        this._userService.getLoggedInUser().subscribe((user) => this.loggedInUser = user);

        this._collectionService.getCollections().subscribe({
            next: collections => {
                collections.forEach(collection => {
                    this.collections.push(collection);
                });
            }
        });

        this.collectionWidth = (window.screen.width - 30) / 2;

        this.collectionForm = new FormGroup({
            'title': new FormControl(null, [Validators.required]),
            'description': new FormControl(null),
            'is_private': new FormControl(null)
        });
    }

    onOpenCollectionForm(): void {
        this.newCollectionModalRef = this._modalService.show(this.newCollectionModal);
    }

    onCloseCollectionForm(): void {
        this.newCollectionModalRef.hide();
    }

    onCollectionSubmit(): void {
        this._collectionService.createCollection(
            this.collectionForm.get('title').value, this.collectionForm.get('description').value, this.collectionForm.get('is_private').value).subscribe((collection: Collection) => {
            this.collections.unshift(collection);
            this.onCloseCollectionForm();
        });
    }

    switchView(view: string): void {
        this.selectedView = view;
        this.collections.sort((a: Collection, b: Collection) => {
            if (view === 'thumbnail') {
                return b.changed - a.changed; 
            }

            return a.name.localeCompare(b.name);
        })
    }
}
