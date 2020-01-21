import {Component, Inject, Input} from '@angular/core';
import {Article} from '../../../../models/article.model';
import {VideoPlayerService} from '../../../../services/video-player.service';
import {DOCUMENT} from '@angular/common';

@Component({
    selector: 'read-next-3',
    templateUrl: 'read-next-3.component.html',
    styleUrls: ['./read-next-3.component.scss']
})

export class ReadNext3Component {
    @Input()
    article: Article;

    constructor(public videoPlayerService: VideoPlayerService, @Inject(DOCUMENT) public doc: Document) {
    }
}