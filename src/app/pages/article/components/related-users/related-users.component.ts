import {Component, Input} from '@angular/core';
import {Article} from '../../../../models/article.model';

@Component({
    selector: 'related-users',
    templateUrl: 'related-users.component.html',
    styleUrls: ['./related-users.component.scss']
})

export class RelatedUsersComponent {
    @Input()
    article: Article;
}