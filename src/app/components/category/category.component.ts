import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Category} from '../../models/category.model';
import {ArticleService} from '../../services/article.service';
import {StringUtilities} from '../../utilities/string';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../reducers/app-state-reducer';
import {Article} from '../../models/article.model';
import {VideoPlayerService} from '../../services/video-player.service';

@Component({
    selector: 'category',
    templateUrl: 'category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
    @Input()
    category: Category;

    @Output() 
    clickArticleDetailsPage: EventEmitter<any> = new EventEmitter;

    isCategoryActive = false;
    showedArticles: Article[] = [];
    excludeArticleIds$: Observable<number[]>;
    excludeArticleIds: number[] = [];
    isLoading = false;

    public numberOfshowedArticles = 5;

    constructor(private _articleService: ArticleService, public videoPlayerService: VideoPlayerService, private _store: Store<AppState>,
        public stringUtilities: StringUtilities) {
    }

    private _updateArticles(articles: Article[]): Article[] {
        let arrArticles = [];
        for (let article of articles) {
            if (arrArticles.length < this.numberOfshowedArticles) {
                if (!this.excludeArticleIds ||
                    (this.excludeArticleIds && this.excludeArticleIds.indexOf(article.id) === -1)) {
                    arrArticles.push(article);
                }
            }
        }

        return arrArticles;
    }

    private _fetchArticles(): void {
        if (this.category.articles.length === 0) {
            this.isLoading = true;
            this._articleService.getArticlesByCategory(this.category.id, 1, 25)
                .subscribe({
                    next: response => {
                        this.isLoading = false;
                        this.category.articles = response.articles;
                        this.showedArticles = this._updateArticles(this.category.articles);
                    }
                });
        }
    }

    ngOnInit(): void {
        this.excludeArticleIds$ = this._store.select(state => state.excludeArticleIds);
        this.excludeArticleIds$.subscribe({
            next: response => {
                this.excludeArticleIds = response;
                this.showedArticles = this._updateArticles(this.category.articles);
            }
        });
    }

    toggleActive(): void {
        this.isCategoryActive = !this.isCategoryActive;

        if (this.isCategoryActive) {
            this._fetchArticles();
        }
    }

    openCategory(): void {
        this.isCategoryActive = true;
        this._fetchArticles();
    }

    closeCategory(): void {
        this.isCategoryActive = false;
    }

    getLatestArticleImage(): string {
        let firstArticle = null;
        if (this.category.articles && this.category.articles.length > 0) {
            for (let article of this.category.articles) {
                if (!this.excludeArticleIds || (this.excludeArticleIds && this.excludeArticleIds.indexOf(article.id) === -1)) {
                    firstArticle = article;
                    break;
                }
            }
        }

        if (firstArticle) {
            return firstArticle.image;
        }

        return this.category.latestArticleImage;
    }

    gotoArticleDetailsPage(): void {
        this.clickArticleDetailsPage.emit();
    }
}
