import {Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {StringUtilities} from '../../../../utilities/string';
import {Article} from '../../../../models/article.model';
import {VideoPlayerService} from '../../../../services/video-player.service';

declare let jQuery: any;

@Component({
    selector: 'group-1',
    templateUrl: 'group-1.component.html',
    styleUrls: ['./group-1.component.scss']
})
export class Group1Component implements OnChanges {
    @Input()
    articles: Article[];

    @ViewChild('firstArticleTitle')
    private _firstArticleTitle: ElementRef;

    constructor(public stringUtilities: StringUtilities, public videoPlayerService: VideoPlayerService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        for (let propertyName in changes) {
            if (propertyName == 'articles') {
                if (this.articles && this.articles.length > 0) {
                    setTimeout(() => {
                        let height = jQuery(this._firstArticleTitle.nativeElement).height();
                        jQuery(this._firstArticleTitle.nativeElement).css('margin-top', (-height / 2) + 'px')
                    }, 1000);
                }
            }
        }
    }
}