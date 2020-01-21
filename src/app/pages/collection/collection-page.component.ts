import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Collection} from '../../models/collection.model';
import {Article} from '../../models/article.model';
import {CollectionService} from '../../services/collection.service';
import {StringUtilities} from '../../utilities/string';
import {AppState} from '../../reducers/app-state-reducer';
import {MetaService} from '../../services/meta.service';
import {HeaderService} from '../../services/header.service';
import {VideoPlayerService} from '../../services/video-player.service';

import * as CurrentPageActions from '../../reducers/current-page/current-page.actions';
import * as TopMenuActions from '../../reducers/top-menu/top-menu.actions';
import {Category} from '../../models/category.model';
import {PhotoSet} from '../../models/photoset.model';
import {ArticleService} from '../../services/article.service';

import {trigger, state, style, animate, transition} from '@angular/animations';
import {PhotoService} from '../../services/photo.service';
import { AlertService } from 'app/services/alert.service';
import { User } from 'app/models/user.model';
import { UserService } from 'app/services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
    selector: 'collection-page',
    templateUrl: './collection-page.component.html',
    styleUrls: ['./collection-page.component.scss'],
    animations: [
        trigger('swipeUpState', [
            state('active', style({
                opacity: '1',
                top: '0'
            })),
            state('inactive', style({
                opacity: '0',
                top: '100%'
            })),
            transition('inactive => active', animate('200ms ease-in')),
            transition('active => inactive', animate('200ms ease-out'))
        ])
    ]
})

export class CollectionPageComponent implements OnInit {
    private _errors;
    private _collectionId: number;
    private _lastTop: number;

    @ViewChild('collectionHeader')
    private _collectionHeader: ElementRef;

    @ViewChild('articleBottomBar')
    private _articleBottomBar: ElementRef;

    @ViewChild('collectionModal')
    collectionModal: ElementRef;

    public collection: Collection;

    public categories: Category[];
    public photoSets: PhotoSet[] = [];
    public collections: Collection[];

    public categoriesState = 'inactive';
    public collectionsState = 'inactive';
    public photoSetsState = 'inactive';

    public loggedInUser: User;

    private _totalPhotoSets: number;

    public collectionForm: FormGroup;
    public collectionModalRef: BsModalRef;

    private _pageNumber = 1;
    private _articlesPerPage = 20;
    public isLoading = true;

    constructor(private _route: ActivatedRoute, private _collectionService: CollectionService,
                private _articleService: ArticleService, private _alertService: AlertService,
                public stringUtilities: StringUtilities, public headerService: HeaderService,
                private _metaService: MetaService, private _photoService: PhotoService, 
                private _router: Router, private _modalService: BsModalService,
                private _store: Store<AppState>, public videoPlayerService: VideoPlayerService, 
                private _userService: UserService) {
        this._store.dispatch(new TopMenuActions.SetTopMenuStyle('normal'));
        this._store.dispatch(new CurrentPageActions.SetCurrentPage('collections'));
    }

    ngOnInit(): void {
        this._userService.getLoggedInUser().subscribe((user) => this.loggedInUser = user);

        this._articleService.getArticleCategories().subscribe({
            next: categories => {
                this.categories = categories;
            }
        });

        this._route.params.subscribe(params => {
            this.categoriesState = 'inactive';
            this.collectionsState = 'inactive';
            this.photoSetsState = 'inactive';

            this._collectionId = +params['collectionId'];
            this._collectionService.getCollectionById(this._collectionId, this._pageNumber, this._articlesPerPage).subscribe({
                next: collection => {
                    this.collection = collection;
                    this.isLoading = false;

                    this._metaService.setTitle(this.collection.name);

                    if (this.collection.image) {
                        this._metaService.setTag('og:image', this.collection.image);
                        this._metaService.setTag('og:url', location.href);
                    }

                    this.collectionForm = new FormGroup({
                        'title': new FormControl(this.collection.name, [Validators.required]),
                        'description': new FormControl(this.collection.body),
                        'is_private': new FormControl(this.collection.isPrivate)
                    });
                },
                error: errors => this._errors = errors
            });
        });

        this.loadPhotos();
    }

    loadPhotos(): void {
        this._photoService.getLatestPhotoSets(0, 20).subscribe({
            next: response => {
                this._totalPhotoSets = response.total;
                for (let photoSet of response.photoSets) {
                    this.photoSets.push(photoSet);
                }
            }
        });
    }

    viewArticleDetails() {
        this._articleService.previousPage = {
            name: 'Collection',
            url: this._router.url,
            data: {
                collectionId: this.collection.id,
                collectionName: this.collection.name
            }
        }
    }

    onRemoveArticle(article: Article) {
        this._alertService.clear();
        
        this._collectionService.removeArticleFromCollection(article.id, this.collection.id).subscribe({
            next: response => {
                if (response.success) {
                    this._alertService.success(response.msg);

                    this.collection.articles = this.collection.articles.filter(a => a.id !== article.id);
                } else {
                    this._alertService.error(response.msg);
                }
            }
        });
    }

    deleteCollection(): void {
        this._collectionService.deleteCollection(this.collection.id).subscribe({
            next: response => {
                this._router.navigate(['/collections']);
            }
        });
    }

    editCollection(): void {
        this.collectionModalRef = this._modalService.show(this.collectionModal);
    }

    onCollectionSubmit(): void {
        this._collectionService.updateCollection(this.collection.id, this.collectionForm.get('title').value, this.collectionForm.get('description').value, this.collectionForm.get('is_private').value).subscribe((collection: Collection) => {
            this.collection.name = collection.name;
            this.collection.body = collection.body;
            this.collection.isPrivate = collection.isPrivate;

            this.collectionForm.reset();
            this.collectionModalRef.hide();
        });
    }

    onCloseCollectionForm(): void {
        this.collectionModalRef.hide();
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        const scrollY = window.scrollY;

        if (this._collectionHeader) {
            if (scrollY > 100 && scrollY > this._lastTop) {
                this._collectionHeader.nativeElement.classList.add('fixed');
            } else {
                this._collectionHeader.nativeElement.classList.remove('fixed');
            }

            if (scrollY > this._lastTop) {
                this._collectionHeader.nativeElement.classList.add('fixed');
            } else {
                this._collectionHeader.nativeElement.classList.remove('fixed');
            }
        }

        if (this._articleBottomBar) {
            if (scrollY > this._lastTop) {
                this._articleBottomBar.nativeElement.classList.add('show');
            } else {
                this._articleBottomBar.nativeElement.classList.remove('show');
            }
        }

        this._lastTop = scrollY;
    }

    loadMoreArticles(): void {
        this._collectionService.getCollectionById(this._collectionId, this._pageNumber, this._articlesPerPage).subscribe({
            next: collection => {
                this.isLoading = false;
                
                for (const article of collection.articles) {
                    this.collection.articles.push(article);
                }
            },
            error: errors => this._errors = errors
        });
    }

    onScrollDown() {
        if (this.collection.articles.length < this.collection.nArticles) {
            this._pageNumber++;
            this.isLoading = true;
            this.loadMoreArticles();
        }
    }
}