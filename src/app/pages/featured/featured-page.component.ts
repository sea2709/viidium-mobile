import {Component, OnInit} from '@angular/core';
import {MetaService} from '../../services/meta.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../reducers/app-state-reducer';
import {SlugifyPipe} from '../../pipes/slugify.pipe';
import {StringUtilities} from '../../utilities/string';

import * as TopMenuActions from '../../reducers/top-menu/top-menu.actions';
import * as CurrentPageActions from '../../reducers/current-page/current-page.actions';

import {Article} from '../../models/article.model';
import { HeaderService } from 'app/services/header.service';
import { ArticleService } from 'app/services/article.service';
import { Router } from '@angular/router';
import { User } from 'app/models/user.model';
import { UserService } from 'app/services/user.service';
import { GroupService } from 'app/services/group.service';
import { Group } from 'app/models/group.model';
import { SettingService } from 'app/services/setting.service';

@Component({
    selector: 'featured-page',
    templateUrl: './featured-page.component.html',
    styleUrls: ['./featured-page.component.scss']
})

export class FeaturedPageComponent implements OnInit {
    public featuredGroup: Group = null;
    public articles: Article[] = [];
    public isLoading = true;
    public loggedInUser: User;

    constructor(private _metaService: MetaService, private _store: Store<AppState>, 
        private _articleService: ArticleService, private _slugify: SlugifyPipe,
        public headerService: HeaderService, private _router: Router,
        public stringUtilities: StringUtilities, private _userService: UserService,
        private _groupService: GroupService, private _settingService: SettingService) {
        this._store.dispatch(new TopMenuActions.SetTopMenuStyle('transparent'));
        this._store.dispatch(new CurrentPageActions.SetCurrentPage('highlights'));
    }

    ngOnInit(): void {
        this._userService.getLoggedInUser().subscribe((user) => this.loggedInUser = user);

        this._metaService.setTitle('Featured Articles');

        this._articleService.getFeaturedArticles().subscribe({
            next: articles => this.articles = articles
        });
    }

    viewArticleDetails() {
        this._articleService.previousPage = {
            name: 'Featured Articles',
            url: this._router.url
        }
    }

    gotoArticleDetails(event: Event, article: Article) {
        if (event.srcElement.className.indexOf('vi-article-wrapper') > -1) {
            this.viewArticleDetails();
            this._router.navigate(['/article', article.id, this._slugify.transform(article.name)]);
        }
    }

    toggleFeatured(article: Article): void {
        this._groupService.removeArticleFromGroup(this._settingService.configurations['featured_group'], article).subscribe(() => {
            this.articles = this.articles.filter((a) => {
                return a.id != article.id;
            });
        });
    }

    canFeatured(): boolean {
        return this.loggedInUser && this.loggedInUser.canFeaturedArticle();
    }
}
