import {Component, OnInit} from '@angular/core';
import {MetaService} from '../../services/meta.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../reducers/app-state-reducer';

import * as TopMenuActions from '../../reducers/top-menu/top-menu.actions';
import * as CurrentPageActions from '../../reducers/current-page/current-page.actions';
import {SettingService} from '../../services/setting.service';
import {GroupService} from '../../services/group.service';
import {Group} from '../../models/group.model';
import { HeaderService } from 'app/services/header.service';
import { ArticleService } from 'app/services/article.service';
import { Router } from '@angular/router';
import { Article } from 'app/models/article.model';
import { StringUtilities } from 'app/utilities/string';

@Component({
    selector: 'highlights-page',
    templateUrl: './highlights-page.component.html',
    styleUrls: ['./highlights-page.component.scss']
})

export class HighlightsPageComponent implements OnInit {
    public todayGroup: Group;

    constructor(private _metaService: MetaService, private _store: Store<AppState>, private _articleService: ArticleService,
        private _settingService: SettingService, private _groupService: GroupService, public headerService: HeaderService,
        private _router: Router, public stringUtilities: StringUtilities) {
        this._store.dispatch(new TopMenuActions.SetTopMenuStyle('transparent'));
        this._store.dispatch(new CurrentPageActions.SetCurrentPage('highlights'));
    }

    ngOnInit(): void {
        this._metaService.setTitle('Our Picks');
        if (this._settingService.configurations['group_special_in_day']) {
            this._groupService.getGroupById(this._settingService.configurations['group_special_in_day']).subscribe({
                next: response => {
                    this.todayGroup = response;
                }
            });
        }
    }

    viewArticleDetails(): void {
        this._articleService.previousPage = {
            name: 'Our Picks',
            url: this._router.url
        }
    }

    removeArticle(article: Article): void {
        this._groupService.removeArticleFromGroup(this.todayGroup.id, article).subscribe({
            next: (group: Group) => {
                if (group.id && group.articles.findIndex(a => a.id == article.id) === -1) {
                    this.todayGroup.articles = this.todayGroup.articles.filter(a => a.id != article.id);
                }
            }
        });
    }
}
