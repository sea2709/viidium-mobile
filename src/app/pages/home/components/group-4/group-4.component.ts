import {Component, Input, OnInit} from '@angular/core';
import {StringUtilities} from '../../../../utilities/string';
import {Article} from '../../../../models/article.model';
import {VideoPlayerService} from '../../../../services/video-player.service';

@Component({
    selector: 'group-4',
    templateUrl: 'group-4.component.html',
    styleUrls: ['./group-4.component.scss']
})
export class Group4Component implements OnInit {
    public deviceWidth: number;

    @Input()
    articles: Article[];
    constructor(public stringUtilities: StringUtilities, public videoPlayerService: VideoPlayerService) {}

    ngOnInit(): void {
        this.deviceWidth = window.screen.width;
    }
}