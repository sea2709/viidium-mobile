import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../services/user.service';
import {AppState} from '../../reducers/app-state-reducer';
import {User} from '../../models/user.model';
import {MetaService} from '../../services/meta.service';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute} from '@angular/router';
import {ArticleService} from '../../services/article.service';
import {Article} from '../../models/article.model';

import * as TopMenuActions from '../../reducers/top-menu/top-menu.actions';
import * as CurrentPageActions from '../../reducers/current-page/current-page.actions';
import * as ViewedUserActions from '../../reducers/viewed-user/viewed-user.actions';

@Component({
    selector: 'profile-page',
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.scss']
})

export class ProfilePageComponent implements OnInit {
    @ViewChild('pendingPosts')
    pendingPosts: any;

    public profileUser: User;
    public loggedInUser: User;
    public loggedInUser$: Observable<User>;
    public articles: Article[] = [];
    public submittedArticlesInfo: any;

    private _username: string;

    constructor(private _metaService: MetaService, private _userService: UserService,
        private _articleService: ArticleService, private _store: Store<AppState>, private _route: ActivatedRoute) {
        this._store.dispatch(new TopMenuActions.SetTopMenuStyle('profile'));
        this._store.dispatch(new CurrentPageActions.SetCurrentPage('profile'));
        this.loggedInUser$ = this._store.select(state => state.loggedInUser);
    }

    private _readSubmittedArticlesInfo(): void {
        this._articleService.getSubmittedArticlesInfo(this.profileUser.id).subscribe({
            next: response => {
                this.submittedArticlesInfo = response;
                for (let key of Object.keys(this.submittedArticlesInfo)) {
                    this.submittedArticlesInfo[key] = +this.submittedArticlesInfo[key];
                }
            }
        });
    }

    ngOnInit(): void {
        this.loggedInUser$.subscribe({
            next: user => {
                this.loggedInUser = user;
            }
        });

        this._route.params.subscribe(params => {
            this._username = params['username'];
            this._userService.getUser(this._username).subscribe({
                next: user => {
                    this.profileUser = user;
                    if (this.profileUser) {
                        this._metaService.setTitle(this.profileUser.name);
                        this._store.dispatch(new ViewedUserActions.SetViewedUser(this.profileUser));

                        this._readSubmittedArticlesInfo();
                    }
                }
            });
        });
    }

    isViewingYourself(): boolean {
        return this.profileUser && this.loggedInUser && this.profileUser.id === this.loggedInUser.id;
    }

    updateArticlesInfo(): void {
        if (this.loggedInUser && this.profileUser.id === this.loggedInUser.id) {
            this._readSubmittedArticlesInfo();
            this.pendingPosts.readPosts();
        }
    }
}
