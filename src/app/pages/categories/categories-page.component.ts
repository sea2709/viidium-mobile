import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ArticleService} from '../../services/article.service';
import {MetaService} from '../../services/meta.service';
import {StringUtilities} from '../../utilities/string';
import {Category} from '../../models/category.model';
import {Store} from '@ngrx/store';
import {AppState} from '../../reducers/app-state-reducer';
import {Router} from '@angular/router';
import {SlugifyPipe} from '../../pipes/slugify.pipe';

import * as TopMenuActions from '../../reducers/top-menu/top-menu.actions';
import * as ExcludeArticleIdsActions from '../../reducers/exclude-article-ids/exclude-article-ids.actions';
import * as CurrentPageActions from '../../reducers/current-page/current-page.actions';
import {CategoryComponent} from '../../components/category/category.component';
import { HeaderService } from 'app/services/header.service';
import { CategoryControlsService } from 'app/services/category.controls.service';

declare let moment: any;

@Component({
    selector: 'categories-page',
    templateUrl: './categories-page.component.html',
    styleUrls: ['./categories-page.component.scss']
})

export class CategoriesPageComponent implements OnInit {
    private _errors;

    categories: Category[];

    @ViewChildren(CategoryComponent)
    categoryCmps: QueryList<CategoryComponent>;

    constructor(private _articleService: ArticleService, private _metaService: MetaService, 
        private _categoryControlsService: CategoryControlsService, private _store: Store<AppState>, 
        public stringUtilities: StringUtilities, public headerService: HeaderService, private _router: Router,
        private _slugify: SlugifyPipe) {
        this._store.dispatch(new TopMenuActions.SetTopMenuStyle('transparent'));
        this._store.dispatch(new CurrentPageActions.SetCurrentPage('categories'));
    }

    ngOnInit(): void {
        this._metaService.setTitle('Categories');

        this._store.dispatch(new ExcludeArticleIdsActions.SetExcludeArticleIds([]));

        this._articleService.getArticleCategories()
            .subscribe({
                next: categories => {
                    this.categories = categories;
                    this._categoryControlsService.initData(this.categories);
                    this._categoryControlsService.change.subscribe((arrCategoryState) => {
                        this.categoryCmps.forEach((categoryInstance) => {
                            if (arrCategoryState[categoryInstance.category.id]) {
                                categoryInstance.openCategory();
                            } else {
                                categoryInstance.closeCategory();
                            }
                        });
                    });
                },
                error: errors => this._errors = errors
            });
    }

    viewArticleDetails(cat: Category) {
        this._articleService.previousPage = {
            name: 'Category',
            url: this._router.createUrlTree(['/categories', cat.id, this._slugify.transform(cat.name)]).toString(),
            data: {
                categoryId: cat.id
            }
        };
    }
}
