import {Component, HostListener, Inject, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef} from '@angular/core';
import {ArticleService} from '../../../../services/article.service';
import {StringUtilities} from '../../../../utilities/string';

import {Group} from '../../../../models/group.model';
import {LatestArticlesCollection} from '../../../../models/latestarticlescollection.model';
import {Category} from '../../../../models/category.model';
import {DOCUMENT} from '@angular/common';
import { GroupService } from 'app/services/group.service';
import { GetArticlesResponse } from 'app/services/responses/getArticles.response';

@Component({
    selector: 'latest-articles',
    templateUrl: 'latest-articles.component.html',
    styleUrls: ['./latest-articles.component.scss']
})
export class LatestArticelsComponent implements OnInit {
    private _fromArticle = 0;
    private _nGroup = 0;
    private _numberOfArticlePerPage = 25;
    private _loadedAll = false;
    private _articleIdsInGroups: number[] = [];
    private _lastTop: number;
    private _winHeight: number;

    @Input()
    groups: Group[];

    @Input()
    categories: Category[];

    public isLoading = true;
    public firstGroup: Group;
    public lastGroup: Group;
    public latestArticlesCollections: LatestArticlesCollection[] = [];

    constructor(private _articleService: ArticleService, public stringUtilities: StringUtilities,
        @Inject(DOCUMENT) public doc: Document, private _cd: ChangeDetectorRef, private _groupService: GroupService) {}

    private _loadArticles(): void {
        this.isLoading = true;
        this._articleService.getLatestArticles(this._fromArticle, this._numberOfArticlePerPage,
            this._articleIdsInGroups).subscribe({
            next: response => {
                this.isLoading = false;
                const articles = response.articles;
                const newLatestArticlesCollection = new LatestArticlesCollection();
                newLatestArticlesCollection.articles = articles;
                this.latestArticlesCollections.push(newLatestArticlesCollection);

                this._fromArticle += articles.length;
                this._nGroup++;

                if (articles.length < this._numberOfArticlePerPage) {
                    this._loadedAll = true;
                }
            }
        });
    }

    ngOnInit(): void {
        this._lastTop = this.doc.body.scrollTop;
        this._winHeight = window.innerHeight;

        if (this.groups) {
            for (const group of this.groups) {
                if (group) {
                    for (const article of group.articles) {
                        this._articleIdsInGroups.push(article.id);
                    }
                }
            }

            this.firstGroup = this.groups.shift();
            this.lastGroup = this.groups.pop();

            this._loadArticles();
        }

        this._groupService.updatedGroup$.subscribe(g => {
            if (this.firstGroup && this.firstGroup.id == g.id) {
                this.firstGroup = g;
            } else {
                if (this.lastGroup && this.lastGroup.id == g.id) {
                    this.lastGroup = g;
                } else {
                    for (const idx in this.groups) {
                        const group = this.groups[idx];
                        if (group.id == g.id) {
                            this.groups[idx] = g;
        
                            break;
                        }
                    }
                }
            }
            
            this._articleIdsInGroups = [];
            if (this.firstGroup) {
                for (const article of this.firstGroup.articles) {
                    this._articleIdsInGroups.push(article.id);
                }
            }
            if (this.lastGroup) {
                for (const article of this.lastGroup.articles) {
                    this._articleIdsInGroups.push(article.id);
                }
            }
            for (const group of this.groups) {
                if (group) {
                    for (const article of group.articles) {
                        this._articleIdsInGroups.push(article.id);
                    }
                }
            }
        });

        this._articleService.updateLatestArticles$.subscribe(
            latestArticles => {
                const nArticles = latestArticles.length;
                if (nArticles < this._nGroup * this._numberOfArticlePerPage) {
                    this._articleService.getLatestArticles(nArticles, this._nGroup * this._numberOfArticlePerPage - nArticles, this._articleIdsInGroups).subscribe(
                        (response: GetArticlesResponse) => {
                            response.articles.forEach(a => latestArticles.push(a));
                            let idx = 0;
                            this.latestArticlesCollections = [];
                            while (idx < this._nGroup) {
                                const articles = latestArticles.slice(idx * this._numberOfArticlePerPage, (idx + 1) * this._numberOfArticlePerPage);
                                const newLatestArticlesCollection = new LatestArticlesCollection();
                                newLatestArticlesCollection.articles = articles;
                                this.latestArticlesCollections.push(newLatestArticlesCollection);
                                idx++;
                            }
                        }
                    );
                } else {
                    let idx = 0;
                    this.latestArticlesCollections = [];
                    while (idx < this._nGroup) {
                        const articles = latestArticles.slice(idx * this._numberOfArticlePerPage, (idx + 1) * this._numberOfArticlePerPage);
                        const newLatestArticlesCollection = new LatestArticlesCollection();
                        newLatestArticlesCollection.articles = articles;
                        this.latestArticlesCollections.push(newLatestArticlesCollection);
                        idx++;
                    }
                }
            }
        );
    }

    onScrollDown(): void {
        if (!this.isLoading && !this._loadedAll) {
            this._loadArticles();
        }
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        const scrollY = window.scrollY;

        if (scrollY > this._lastTop) {
            const docHeight = document.documentElement.offsetHeight;
            if (scrollY + this._winHeight + 200 > docHeight) {
                this.onScrollDown();
            }
        }

        this._lastTop = scrollY;
    }
}