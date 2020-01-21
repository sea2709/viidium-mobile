import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Article} from '../../../../models/article.model';
import {StringUtilities} from '../../../../utilities/string';

@Component({
    selector: 'articles-panel',
    templateUrl: 'articles-panel.component.html',
    styleUrls: ['./articles-panel.component.scss']
})

export class ArticlesPanelComponent implements OnInit {
    @Input()
    prevArticles: Article[];

    @Input()
    article: Article;

    @Input()
    nextArticles: Article[];

    @ViewChild('currentArticleElement')
    private _currentArticleElement: ElementRef;

    private _winHeight: number;

    constructor(public stringUtilities: StringUtilities) {}

    ngOnInit(): void {
        this._winHeight = window.innerHeight;
    }

    getCurrentArticleTopPosition(): number {
        return this._currentArticleElement.nativeElement.offsetTop;
    }
}
