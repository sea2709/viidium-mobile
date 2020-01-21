import {Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {Category} from '../../models/category.model';
import {ArticleService} from '../../services/article.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MetaService} from '../../services/meta.service';
import {DOCUMENT} from '@angular/common';
import {Store} from '@ngrx/store';
import {VideoPlayerService} from '../../services/video-player.service';
import {HeaderService} from '../../services/header.service';
import {AppState} from '../../reducers/app-state-reducer';

import * as TopMenuActions from '../../reducers/top-menu/top-menu.actions';
import * as CurrentPageActions from '../../reducers/current-page/current-page.actions';
import {Group} from '../../models/group.model';

import {trigger, state, style, animate, transition} from '@angular/animations';
import {SettingService} from '../../services/setting.service';
import {GroupService} from '../../services/group.service';

@Component({
    selector: 'category-page',
    templateUrl: './category-page.component.html',
    styleUrls: ['./category-page.component.scss'],
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

export class CategoryPageComponent implements OnInit {
    private _errors;
    private _categoryId: number;
    private _pageNumber = 1;
    private _articlesPerPage = 20;
    private _total: number;
    private _lastTop: number;

    @ViewChild('categoryHeader')
    private _categoryHeader: ElementRef;

    @ViewChild('articleBottomBar')
    private _articleBottomBar: ElementRef;

    public categories: Category[];
    public category: Category;
    public todayGroup: Group;
    public isLoading = true;
    public categoriesState = 'inactive';
    public highlightsState = 'inactive';
    public collectionsState = 'inactive';

    constructor(private _route: ActivatedRoute, private _articleService: ArticleService, private _router: Router,
                private _metaService: MetaService, private _settingService: SettingService,
                private _groupService: GroupService, @Inject(DOCUMENT) private _document: Document,
                private _store: Store<AppState>, public videoPlayerService: VideoPlayerService, public headerService: HeaderService) {
        this._store.dispatch(new TopMenuActions.SetTopMenuStyle('transparent'));
        this._store.dispatch(new CurrentPageActions.SetCurrentPage('category'));
    }

    ngOnInit(): void {
        if (this._settingService.configurations['group_special_in_day']) {
            this._groupService.getGroupById(this._settingService.configurations['group_special_in_day']).subscribe({
                next: response => this.todayGroup = response
            });
        }

        this._route.params.subscribe(params => {
            this.categoriesState = 'inactive';
            this.highlightsState = 'inactive';
            this.collectionsState = 'inactive';
            this._pageNumber = 1;

            this._categoryId = +params['categoryId'];
            this._articleService.getArticleCategories().subscribe({
                next: categories => {
                    this.categories = categories;
                    let selectedCategories = categories.filter(category => category.id == this._categoryId);

                    if (selectedCategories.length === 0) {
                        this._router.navigate(['/not-found']);
                    } else {
                        this.category = selectedCategories[0];

                        this._metaService.setTitle(this.category.name);
                        this._metaService.setTag('description', this.category.description);
                        this._metaService.setTag('og:description', this.category.description);
                        this._metaService.setTag('og:url', location.href);

                        if (this.category.latestArticleImage) {
                            this._metaService.setTag('og:image', this.category.latestArticleImage);
                        }

                        this.loadArticles();
                    }
                },
                error: errors => this._errors = errors
            });
        });

        this._lastTop = this._document.body.scrollTop;
    }

    loadArticles(): void {
        this._articleService.getArticlesByCategory(this.category.id, this._pageNumber, this._articlesPerPage)
            .subscribe({
                next: response => {
                    this._total = response.total;
                    for (let article of response.articles) {
                        this.category.articles.push(article);
                    }
                    this.isLoading = false;
                },
                error: errors => {
                    this._errors = errors;
                }
            });
    }

    onScrollDown() {
        this.loadMore();
    }

    loadMore(): void {
        if (this.category.articles.length < this._total) {
            this._pageNumber++;
            this.isLoading = true;
            this.loadArticles();
        }
    }

    viewArticleDetails() {
        this._articleService.previousPage = {
            name: 'Category',
            url: this._router.url,
            data: {
                categoryId: this.category.id
            }
        }
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        if (this._categoryHeader) {
            const scrollY = window.scrollY;

            if (scrollY > 100 && scrollY > this._lastTop) {
                this._categoryHeader.nativeElement.classList.add('show');
            } else {
                this._categoryHeader.nativeElement.classList.remove('show');
            }

            if (scrollY > this._lastTop) {
                this._articleBottomBar.nativeElement.classList.add('show');
            } else {
                this._articleBottomBar.nativeElement.classList.remove('show');
            }

            this._lastTop = scrollY;
        }
    }
}