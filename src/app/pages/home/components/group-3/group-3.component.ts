import {Component, Input} from '@angular/core';
import {StringUtilities} from '../../../../utilities/string';
import {Article} from '../../../../models/article.model';
import {VideoPlayerService} from '../../../../services/video-player.service';

@Component({
    selector: 'group-3',
    templateUrl: 'group-3.component.html',
    styleUrls: ['./group-3.component.scss']
})
export class Group3Component {
    @Input()
    articles: Article[];

    @Input()
    showVideos = true;

    constructor(public stringUtilities: StringUtilities, public videoPlayerService: VideoPlayerService) {}
}