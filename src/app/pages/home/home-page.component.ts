import {Component, Inject, OnInit, ChangeDetectorRef} from '@angular/core';
import {Category} from '../../models/category.model';
import {ArticleService} from '../../services/article.service';
import {MetaService} from '../../services/meta.service';
import {HeaderService} from '../../services/header.service';
import {DOCUMENT} from '@angular/common';
import {Store} from '@ngrx/store';
import {AppState} from '../../reducers/app-state-reducer';
import {Group} from '../../models/group.model';
import {ActivatedRoute} from '@angular/router';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

import * as CurrentPageActions from '../../reducers/current-page/current-page.actions';
import * as TopMenuActions from '../../reducers/top-menu/top-menu.actions';
import { Article } from 'app/models/article.model';
import { GroupService } from 'app/services/group.service';

@Component({
    selector: 'home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})

export class HomePageComponent implements OnInit {
    private _lastTop: number;

    categories: Category[];
    groups: Group[];
    article: Article;

    constructor(private _articleService: ArticleService, private _groupService: GroupService,
        private _metaService: MetaService, private _store: Store<AppState>,
        private _route: ActivatedRoute, @Inject(DOCUMENT) private document: Document, 
        public headerService: HeaderService, private _cd: ChangeDetectorRef) {
        this._store.dispatch(new TopMenuActions.SetTopMenuStyle('normal'));
        this._store.dispatch(new CurrentPageActions.SetCurrentPage('home'));

        this._metaService.setTitle('');
    }

    ngOnInit(): void {
        this._articleService.getArticleCategories().subscribe({
            next: categories => {
                this.categories = categories;
            }
        });

        this._articleService.getFeaturedArticles().subscribe({
            next: articles => {
                if (articles && articles.length > 0) {
                    this.article = articles[0];
                }
            }
        });

        this._route.data
            .subscribe((data: { groups: Group[] }) => {
                this.groups = data.groups.filter(group => group);
            });

        // this._groupService.updatedGroup$.subscribe(g => {
        //     this.groups[g.id] = g;
        //     this._cd.detectChanges();
        // });

        this._lastTop = this.document.body.scrollTop;
    }

    toggleSearch(e) {
        e.preventDefault();
        this.headerService.toggleSearch();
    }
}