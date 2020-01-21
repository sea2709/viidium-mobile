import {Component, Input} from '@angular/core';
import {StringUtilities} from '../../../../utilities/string';
import {Article} from '../../../../models/article.model';
import {VideoPlayerService} from '../../../../services/video-player.service';

@Component({
    selector: 'group-5',
    templateUrl: 'group-5.component.html',
    styleUrls: ['./group-5.component.scss']
})
export class Group5Component {
    @Input()
    articles: Article[];

    constructor(public stringUtilities: StringUtilities, public videoPlayerService: VideoPlayerService) {}
}