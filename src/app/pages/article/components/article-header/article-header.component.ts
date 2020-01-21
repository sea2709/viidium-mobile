import {Component, Input, Inject} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {Article} from '../../../../models/article.model';

@Component({
    selector: 'article-header',
    templateUrl: 'article-header.component.html',
    styleUrls: ['./article-header.component.scss']
})

export class ArticleHeaderComponent {
  @Input()
  article: Article;

  constructor(@Inject(DOCUMENT) public doc: Document) {
  }
}