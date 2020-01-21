import {Component, Inject, Input} from '@angular/core';
import {Article} from '../../../../models/article.model';
import {VideoPlayerService} from '../../../../services/video-player.service';
import {DOCUMENT} from '@angular/common';

@Component({
    selector: 'read-next-2',
    templateUrl: 'read-next-2.component.html',
    styleUrls: ['./read-next-2.component.scss']
})

export class ReadNext2Component {
    @Input()
    article: Article;

    constructor(public videoPlayerService: VideoPlayerService, @Inject(DOCUMENT) public doc: Document) {
    }
}