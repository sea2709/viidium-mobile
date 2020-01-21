import {Component, Inject, Input, OnInit} from '@angular/core';
import {Article} from '../../models/article.model';
import {DOCUMENT} from '@angular/common';
import {Router} from '@angular/router';
import {SlugifyPipe} from '../../pipes/slugify.pipe';

@Component({
    selector: 'shares',
    templateUrl: './shares.component.html',
    styleUrls: ['./shares.component.scss']
})
export class SharesComponent implements OnInit {
    @Input()
    article: Article;

    articleUrl: string;

    constructor(@Inject(DOCUMENT) public doc: Document, private _router: Router, private _slugify: SlugifyPipe) {
    }

    ngOnInit(): void {
        this.articleUrl = document.location.origin + this._router.createUrlTree(
            ['/article', this.article.id, this._slugify.transform(this.article.name)]).toString();
    }
}
