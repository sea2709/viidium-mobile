import {Component, ElementRef, HostListener, Inject, OnInit, ViewChild, QueryList, ViewChildren} from '@angular/core';

import {BsModalRef} from 'ngx-bootstrap/modal';
import {ArticleService} from '../../services/article.service';
import {Article} from '../../models/article.model';
import {ActivatedRoute, Router} from '@angular/router';
import {StringUtilities} from '../../utilities/string';
import {DomSanitizer} from '@angular/platform-browser';
import {MetaService} from '../../services/meta.service';
import {DOCUMENT} from '@angular/common';
import {Store} from '@ngrx/store';
import {VideoPlayerService} from '../../services/video-player.service';
import {AppState} from '../../reducers/app-state-reducer';
import {Category} from '../../models/category.model';
import {Group} from '../../models/group.model';
import {SettingService} from '../../services/setting.service';
import {GroupService} from '../../services/group.service';
import {ArticlesPanelComponent} from './components/articles-panel/articles-panel.component';
import {Observable} from 'rxjs/Observable';
import {SlugifyPipe} from '../../pipes/slugify.pipe';
import {CategoryComponent} from '../../components/category/category.component';

import * as TopMenuActions from '../../reducers/top-menu/top-menu.actions';
import * as CurrentPageActions from '../../reducers/current-page/current-page.actions';

import {trigger, state, style, animate, transition} from '@angular/animations';
import { CollectionService } from 'app/services/collection.service';
import { Collection } from 'app/models/collection.model';

declare let jQuery: any;

@Component({
    selector: 'page-article',
    templateUrl: 'article-page.component.html',
    styleUrls: ['./article-page.component.scss'],
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

export class ArticlePageComponent implements OnInit {
    private _errors;
    private _articleId: number;
    private _lastTop: number;
    private _album: any[] = [];
    private _winHeight: number;

    public prevArticles: Article[] = [];
    public nextArticles: Article[] = [];
    public relatedArticles: Article[];
    public trendingArticles: Article[];
    public previousArticle: Article;
    public nextArticle: Article;
    public previousPageArticle: Article;
    public nextPageArticle: Article;
    public article: Article;
    public sanitizedContent;
    public categoriesState = 'inactive';
    public highlightsState = 'inactive';
    public articlesState = 'inactive';
    public categories: Category[] = [];
    public todayGroup: Group;
    public collections: Collection[] = [];
    public isLoadingArticlesInPanel = false;
    public isAssigningCollections = false;

    previousPage$: Observable<any>;
    previousPage: string;

    @ViewChild('articlesPanel')
    private _articlesPanel: ArticlesPanelComponent;

    @ViewChild('articlesLightbox')
    private _articlesLightbox: ElementRef;

    @ViewChild('articleBottomBar')
    private _articleBottomBar: ElementRef;

    @ViewChildren(CategoryComponent)
    categoryCmps: QueryList<CategoryComponent>;

    @ViewChild('alertModal')
    alertModal: ElementRef;

    @ViewChild('collectionsModal')
    collectionsModal: ElementRef;

    private _loadedAllPrevArticles = false;
    private _loadedAllNextArticles = false;

    public alertModalRef: BsModalRef;

    constructor(private _route: ActivatedRoute, private _articleService: ArticleService,
                private _settingService: SettingService, private _groupService: GroupService,
                private _metaService: MetaService, private _collectionService: CollectionService,
                public stringUtilities: StringUtilities,
                @Inject(DOCUMENT) public doc: Document, private _router: Router,
                private _domSanitizer: DomSanitizer, private _store: Store<AppState>,
                public videoPlayerService: VideoPlayerService, private _slugify: SlugifyPipe) {
        this._store.dispatch(new TopMenuActions.SetTopMenuStyle('transparent'));
        this._store.dispatch(new CurrentPageActions.SetCurrentPage('article'));

        this.previousPage = null;
    }

    private _loadOtherArticles(): void {
        this._articleService.getArticlesByCategory(this.article.category.id)
            .subscribe({
                next: response => {
                    this.relatedArticles = response.articles.filter(article => this.article.id != article.id);

                    this._articleService.getTrendingArticles(1, 6)
                        .subscribe({
                            next: (response: {total: number, articles: Article[]}) => {
                                const articles = response.articles;
                                let relatedArticleIds = [];
                                if (this.relatedArticles) {
                                    relatedArticleIds = this.relatedArticles.map(({id}) => id);
                                }
                                this.trendingArticles = articles.filter(
                                    article => (this.article.id != article.id) && (relatedArticleIds.indexOf(article.id) === -1)
                                ).slice(0, 5);
                            },
                            error: errors => this._errors = errors
                        });
                },
                error: errors => this._errors = errors
            });

        this._articleService.getNextArticleById(this.article.id)
            .subscribe({
                next: article => {
                    this.nextArticle = article;
                },
                error: errors => {
                    this._errors = errors;
                }
            });

        this._articleService.getPreviousArticleById(this.article.id)
            .subscribe({
                next: article => this.previousArticle = article,
                error: errors => this._errors = errors
            });

        this._loadPrevArticles(this.article.id);
        this._loadNextArticles(this.article.id);
    }

    private _loadPrevArticles(articleId: number): void {
        if (!this._loadedAllNextArticles) {
            this.isLoadingArticlesInPanel = true;
            this._articleService.getPrevArticlesInCategory(articleId, this.article.category.id)
                .subscribe({
                    next: articles => {
                        if (articles.length === 0) {
                            this._loadedAllPrevArticles = true;
                        } else {
                            for (const article of articles.reverse()) {
                                this.prevArticles.unshift(article);
                            }
                        }

                        this.isLoadingArticlesInPanel = false;
                    }
                });
        }
    }

    private _loadNextArticles(articleId: number): void {
        if (!this._loadedAllNextArticles) {
            this.isLoadingArticlesInPanel = true;
            this._articleService.getNextArticlesInCategory(articleId, this.article.category.id)
                .subscribe({
                    next: articles => {
                        if (articles.length === 0) {
                            this._loadedAllNextArticles = true;
                        } else {
                            for (const article of articles) {
                                this.nextArticles.push(article);
                            }
                        }
                        this.isLoadingArticlesInPanel = false;
                    }
                });
        }
    }

    ngOnInit(): void {
        this._winHeight = window.innerHeight;
        this._articleService.getArticleCategories().subscribe({
            next: categories => this.categories = categories
        });

        if (this._settingService.configurations['group_special_in_day']) {
            this._groupService.getGroupById(this._settingService.configurations['group_special_in_day']).subscribe({
                next: response => this.todayGroup = response
            });
        }

        this._route.params.subscribe(params => {
            this.previousPageArticle = null;
            this.nextPageArticle = null;

            this._articleId = +params['articleId'];
            this._articleService.getArticleById(this._articleId).subscribe({
                next: response => {
                    if (response.id) {
                        this.categoriesState = 'inactive';
                        this.articlesState = 'inactive';
                        this.highlightsState = 'inactive';
                        this._loadedAllNextArticles = false;
                        this._loadedAllPrevArticles = false;
                        this.nextArticles = [];
                        this.prevArticles = [];

                        this.article = response;

                        this._collectionService.getCollections('title', 'ASC').subscribe({
                            next: collections => {
                                collections.forEach(collection => {
                                    if (collection.containArticle(this.article)) {
                                        this.collections.push(collection);
                                    }
                                });
                            }
                        });

                        if (this.article.externalReferral && !this.article.needToRediect()) {
                            this._store.dispatch(new TopMenuActions.SetTopMenuStyle('minimized'));
                        } else {
                            if (this.article.category.groupLayout == 1) {
                                this._store.dispatch(new TopMenuActions.SetTopMenuStyle('transparent'));
                            } else {
                                this._store.dispatch(new TopMenuActions.SetTopMenuStyle('normal'));
                            }
                        }

                        this.sanitizedContent = this._domSanitizer.bypassSecurityTrustHtml(this.article.processed);
                        this._metaService.setTitle(this.article.name);
                        this._metaService.setTag('description', this.article.summary);
                        this._metaService.setTag('og:description', this.article.summary);
                        this._metaService.setTag('og:url', location.href);
                        this._metaService.setTag('og:title', this.article.name);

                        if (this.article.image) {
                            this._metaService.setTag('og:image', this.article.image);
                        }

                        this._articleService.hitArticle(this._articleId).subscribe();

                        this._loadOtherArticles();

                        setTimeout(() => {
                            jQuery('.vi-article-body img').each((idx, ele) => {
                                if (jQuery(ele).parent().prop('tagName') !== 'FIGURE') {
                                    jQuery(ele).wrap('<figure class="caption caption-img"></figure>');
                                    if (jQuery(ele).data('caption')) {
                                        jQuery('<figcaption>' + jQuery(ele).data('caption') + '</figcaption>').insertAfter(ele);
                                    }
                                }
                                let caption = jQuery(ele).data('caption');
                                if (caption) {
                                    caption = caption.replace(/&nbsp;/g, ' ');
                                    let htmlText = jQuery('<div>' + caption + '</div>');
                                    htmlText.find('style').remove();
                                    htmlText.find('script').remove();
                                    caption = htmlText.text();
                                } else {
                                    caption = '';
                                }

                                const photo = {
                                    src: jQuery(ele).attr('src'),
                                    opts: {caption: caption}
                                };
                                this._album.push(photo);
                            });

                            jQuery('.vi-article-body img:not(.vi-photo)').each((idx, ele) => {
                                jQuery(ele).on('click', () => {
                                    jQuery.fancybox.open(this._album, {loop: true}, idx);
                                });
                            });

                            const regex = '<script[^<]*</script>';
                            const scripts = this.article.processed.match(regex);
                            
                            if (scripts) {
                                const wrapper = document.createElement('div');
                                wrapper.innerHTML= scripts.join();

                                for (let idx = 0; idx < wrapper.childNodes.length; idx++) {
                                    const node = wrapper.childNodes.item(idx);
                                    document.getElementsByTagName('head')[0].appendChild(node);
                                }
                            }
                        });

                        this.previousPage = this._articleService.previousPage;
                        if (this._articleService.previousPage) {
                            this._articleService.getPreviousAndNextArticlesByIdAndPage(this._articleId, this._articleService.previousPage.name.toLowerCase(), this._articleService.previousPage.data).subscribe({
                                next: response => {
                                    this.previousPageArticle = response.prev;
                                    this.nextPageArticle = response.next;
                                }
                            });

                            this._articleService.previousPage = null;
                        }
                    } else {
                        this._router.navigate(['/not-found']);
                    }
                }
            });
        });

        this._lastTop = this.doc.body.scrollTop;

        jQuery('.vi-navigation').removeClass('vi-fixed');
    }

    activateArticles(): void {
        this.articlesState = 'active';

        setTimeout(() => {
            let top = this._articlesPanel.getCurrentArticleTopPosition();
            this._articlesLightbox.nativeElement.scrollTop = top - this._winHeight / 3;
        });

        setTimeout(() => {
            this._articlesLightbox.nativeElement.addEventListener(
                'scroll', (event) => this.onScrollArticlesLightbox(event));
        }, 2000);
    }

    onScrollArticlesLightbox(event: Event): void {
        if (!this.isLoadingArticlesInPanel) {
            const targetEle = <HTMLElement>event.target;
            if (targetEle.scrollTop < 20) {
                if (this.prevArticles.length > 0) {
                    this._loadPrevArticles(this.prevArticles[0].id);
                }
            } else {
                if (targetEle.scrollTop + this._winHeight > targetEle.scrollHeight - 20) {
                    if (this.nextArticles.length > 0) {
                        this._loadNextArticles(this.nextArticles[this.nextArticles.length - 1].id);
                    }
                }
            }
        }
    }

    addPreviousPageInfoToStore(): void {
        this._articleService.previousPage = this.previousPage;
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        if (this._articleBottomBar) {
            const scrollY = window.scrollY;

            if (scrollY > this._lastTop) {
                this._articleBottomBar.nativeElement.classList.add('show');
            } else {
                this._articleBottomBar.nativeElement.classList.remove('show');
            }

            this._lastTop = scrollY;
        }
    }

    viewOurpickArticleDetails() {
        this._articleService.previousPage = {
            name: 'Our Picks',
            url: '/our-picks'
        }
    }

    viewCatArticleDetails(cat: Category) {
        this._articleService.previousPage = {
            name: 'Category',
            url: this._router.createUrlTree(['/categories', cat.id, this._slugify.transform(cat.name)]).toString(),
            data: {
                categoryId: cat.id
            }
        };

        this.categoryCmps.forEach((categoryInstance) => {
            if (categoryInstance.category.id === cat.id) {
                categoryInstance.closeCategory();
            }
        });
    }
}