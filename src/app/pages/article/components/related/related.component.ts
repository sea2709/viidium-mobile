import {Component, Input} from '@angular/core';
import {Article} from '../../../../models/article.model';
import {StringUtilities} from '../../../../utilities/string';
import {VideoPlayerService} from '../../../../services/video-player.service';

@Component({
    selector: 'related',
    templateUrl: 'related.component.html',
    styleUrls: ['./related.component.scss']
})

export class RelatedComponent {
    @Input()
    article: Article;

    @Input()
    showHeader = true;

    @Input()
    relatedArticles: Article[];

    constructor(public videoPlayerService: VideoPlayerService, public stringUtilities: StringUtilities) {
    }
}
