import {Component, Input, OnInit} from '@angular/core';
import {Article} from '../../../../models/article.model';
import {Category} from '../../../../models/category.model';
import {ArticleService} from '../../../../services/article.service';

import {trigger, state, style, animate, transition} from '@angular/animations';

@Component({
    selector: 'article-category',
    templateUrl: 'article-category.component.html',
    styleUrls: ['./article-category.component.scss'],
    animations: [
        trigger('categoryState', [
            state('inactive', style({
                height: '35px'
            })),
            state('active', style({
                height: 'auto'
            })),
            transition('inactive => active', animate('200ms ease-in')),
            transition('active => inactive', animate('200ms ease-out'))
        ])
    ]
})

export class ArticleCategoryComponent implements OnInit {
    @Input()
    article: Article;

    public otherCategories: Category[];
    public state = 'inactive';

    constructor(private _articleService: ArticleService) {
    }

    ngOnInit(): void {
        this._articleService.getArticleCategories()
            .subscribe({
                next: categories => {
                    this.otherCategories = categories.filter(category => category.id != this.article.category.id);
                }
            });
    }

    toggleState(): void {
        this.state = this.state === 'active' ? 'inactive' : 'active';
    }
}
