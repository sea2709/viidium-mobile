import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../../models/user.model';
import {Article} from '../../../../models/article.model';
import {ArticleService} from '../../../../services/article.service';
import {StringUtilities} from '../../../../utilities/string';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../reducers/app-state-reducer';

@Component({
    selector: 'posts',
    templateUrl: 'posts.component.html',
    styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
    private _total: number;
    private _articlesPerPage = 20;
    private _page = 1;

    @Input()
    user: User;

    @Input()
    statuses: string[] = ['curated', 'published', 'contributed'];

    @Input()
    showStatus = true;

    public isLoading = true;
    public articles: Article[] = [];
    public loggedInUser: User;
    public loggedInUser$: Observable<User>;

    constructor(private _articleService: ArticleService, public stringUtilities: StringUtilities,
        private _store: Store<AppState>) {
        this.loggedInUser$ = this._store.select(state => state.loggedInUser);
    }

    ngOnInit(): void {
        this.loggedInUser$.subscribe({
            next: user => {
                this.loggedInUser = user;
            }
        });

        this.loadArticles();
    }

    loadArticles(): void {
        this._articleService.getSubmittedArticles(this.user.id, this._page, this._articlesPerPage, this.statuses).subscribe({
            next: response => {
                this._total = response.total;
                for (let article of response.articles) {
                    this.articles.push(article);
                }
                this.isLoading = false;
            }
        });
    }

    onScrollDown() {
        this.loadMore();
    }

    loadMore(): void {
        this._page++;

        if (this.articles.length < this._total) {
            this.isLoading = true;
            this.loadArticles();
        }
    }
}
