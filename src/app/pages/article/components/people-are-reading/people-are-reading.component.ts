import {Component, Input} from '@angular/core';
import {Article} from '../../../../models/article.model';
import {StringUtilities} from '../../../../utilities/string';
import {VideoPlayerService} from '../../../../services/video-player.service';

@Component({
    selector: 'people-are-reading',
    templateUrl: 'people-are-reading.component.html',
    styleUrls: ['./people-are-reading.component.scss']
})

export class PeopleAreReadingComponent {
    @Input()
    article: Article;

    @Input()
    trendingArticles: Article[];

    constructor(public videoPlayerService: VideoPlayerService, public stringUtilities: StringUtilities) {
    }
}
