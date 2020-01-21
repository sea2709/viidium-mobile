import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {Category} from '../../../../models/category.model';
import {ArticleService} from '../../../../services/article.service';

@Component({
    selector: 'other-categories',
    templateUrl: 'other-categories.component.html',
    styleUrls: ['./other-categories.component.scss']
})

export class OtherCategoriesComponent implements OnInit {
    @Input()
    public category: Category;

    public otherCategories: Category[];

    private _errors;

    constructor(private _articleService: ArticleService, public elRef: ElementRef) {}

    ngOnInit(): void {
        this._articleService.getArticleCategories()
            .subscribe({
                next: categories => {
                    this.otherCategories = categories.filter(category => category.id != this.category.id);
                },
                error: errors => this._errors = errors
            });
    }
}