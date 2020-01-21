import {Component, OnInit, Inject, ElementRef, ViewChild} from '@angular/core';
import {ArticleService} from '../../services/article.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MetaService} from '../../services/meta.service';
import {Article} from '../../models/article.model';
import {DOCUMENT} from '@angular/common';
import {Store} from '@ngrx/store';
import {AppState} from '../../reducers/app-state-reducer';

import * as TopMenuActions from '../../reducers/top-menu/top-menu.actions';
import * as CurrentPageActions from '../../reducers/current-page/current-page.actions';
import { StringUtilities } from 'app/utilities/string';

@Component({
    selector: 'search-page',
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {
    private _errors;
    private _lastTop: number;

    pageNumber = 1;
    articlesPerPage = 10;
    articles: Article[];
    total: number;
    isLoading = false;
    query: string;
    tag: string;
    viewMode = 'column';

    @ViewChild('searchTextField')
    private _searchTextField: ElementRef;

    constructor(private _route: ActivatedRoute, private _articleService: ArticleService, 
        private _router: Router, private _metaService: MetaService, private _store: Store<AppState>, 
        @Inject(DOCUMENT) private _document: Document, public stringUtilities: StringUtilities) {
        this._store.dispatch(new TopMenuActions.SetTopMenuStyle('normal'));
        this._store.dispatch(new CurrentPageActions.SetCurrentPage('search'));
    }

    ngOnInit(): void {
        this._lastTop = this._document.body.scrollTop;
        this._metaService.setTitle('Search');

        this._route.queryParams.subscribe(params => {
            this.query = params['q'];
            this.tag = params['t'];

            if (params['page']) {
                this.pageNumber = +params['page'];
            }
            this.isLoading = true;
            this.articles = [];
            this.loadArticles();
        });
    }

    loadArticles(): void {
        this.isLoading = true;
        this._articleService.searchArticles(this.query, this.tag, this.pageNumber, this.articlesPerPage).subscribe({
            next: response => {
                this.total = response.total;
                this.articles = response.articles;
                this.isLoading = false;
            },
            error: errors => {
                this._errors = errors;
            }
        });
    }

    search(): boolean {
        this.query = this._searchTextField.nativeElement.value;

        // redirect to homepage with query string is empty
        if (this.query.trim() === '') {
            this._router.navigate(['/']);

            return false;
        }

        this.pageNumber = 1;
        this.loadArticles();

        return false;
    }

    pageChange(event): void {
        this._router.navigate(['/search'], {queryParams: {q: this.query, page: event}});
    }

    getFromArticle(): number {
        return (this.pageNumber - 1) * this.articlesPerPage + 1;
    }

    getToArticle(): number {
        return this.pageNumber * this.articlesPerPage;
    }
}