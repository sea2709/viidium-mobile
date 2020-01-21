import {Component, Input} from '@angular/core';
import {StringUtilities} from '../../../../utilities/string';
import {Article} from '../../../../models/article.model';
import {VideoPlayerService} from '../../../../services/video-player.service';

@Component({
    selector: 'group-2',
    templateUrl: 'group-2.component.html',
    styleUrls: ['./group-2.component.scss']
})
export class Group2Component {
    @Input()
    articles: Article[];

    constructor(public stringUtilities: StringUtilities, public videoPlayerService: VideoPlayerService) {}
}