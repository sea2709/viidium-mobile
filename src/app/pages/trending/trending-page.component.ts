import {Component, OnInit} from '@angular/core';
import {ArticleService} from '../../services/article.service';
import {MetaService} from '../../services/meta.service';
import {Router} from '@angular/router';
import {Article} from '../../models/article.model';
import {StringUtilities} from '../../utilities/string';
import {SlugifyPipe} from '../../pipes/slugify.pipe';
import {Store} from '@ngrx/store';
import {AppState} from '../../reducers/app-state-reducer';
import {VideoPlayerService} from '../../services/video-player.service';
import {Category} from '../../models/category.model';

import * as TopMenuActions from '../../reducers/top-menu/top-menu.actions';
import * as CurrentPageActions from '../../reducers/current-page/current-page.actions';

import { HeaderService } from 'app/services/header.service';

@Component({
    selector: 'trending-page',
    templateUrl: './trending-page.component.html',
    styleUrls: ['./trending-page.component.scss']
})

export class TrendingPageComponent implements OnInit {
    private _errors;

    public articles: Article[] = [];
    public isLoading = true;
    public categories: Category[];
    private _pageNumber = 1;
    private _articlesPerPage = 20;
    private _total = 0;

    constructor(private _articleService: ArticleService, private _metaService: MetaService, private _router: Router,
                private _store: Store<AppState>, private _slugify: SlugifyPipe, public stringUtilities: StringUtilities,
                public videoPlayerService: VideoPlayerService, public headerService: HeaderService) {
        this._store.dispatch(new TopMenuActions.SetTopMenuStyle('transparent'));
        this._store.dispatch(new CurrentPageActions.SetCurrentPage('trending'));
    }

    ngOnInit(): void {
        this._metaService.setTitle('Trending');

        this._articleService.getArticleCategories().subscribe({
            next: categories => {
                this.categories = categories;
            }
        });

        this.loadArticles();
    }

    gotoArticleDetails(event: Event, article: Article) {
        if (event.srcElement.className.indexOf('vi-article-wrapper') > -1) {
            this.viewArticleDetails();
            this._router.navigate(['/article', article.id, this._slugify.transform(article.name)]);
        }
    }

    viewArticleDetails() {
        this._articleService.previousPage = {
            name: 'Trending',
            url: this._router.url
        }
    }

    onScrollDown() {
        this.loadMore();
    }

    loadMore(): void {
        if (this.articles.length < this._total) {
            this._pageNumber++;
            this.isLoading = true;
            this.loadArticles();
        }
    }

    loadArticles(): void {
        this._articleService.getTrendingArticles(this._pageNumber, this._articlesPerPage).subscribe({
            next: (response: {total: number, articles: Article[]}) => {
                this._total = response.total;
                for (let article of response.articles) {
                    this.articles.push(article);
                }
            },
            error: errors => this._errors = errors
        });
    }
}
