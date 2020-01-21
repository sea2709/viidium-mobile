import {Component, HostListener, Inject, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {Article} from '../../../../models/article.model';
import {DOCUMENT} from '@angular/common';
import {VideoPlayerService} from '../../../../services/video-player.service';
import { Group } from 'app/models/group.model';

declare var jQuery: any;

@Component({
    selector: 'layout-3',
    templateUrl: 'layout-3.component.html',
    styleUrls: ['./layout-3.component.scss']
})

export class Layout3Component implements OnInit {
    @Input()
    article: Article;

    @Input()
    previousArticle: Article;

    @Input()
    nextArticle: Article;

    @Input()
    todayGroup: Group;

    @Output() 
    addToOurPicks: EventEmitter<any> = new EventEmitter;

    @Output() 
    addToCollections: EventEmitter<any> = new EventEmitter;

    @Output()
    repostArticle: EventEmitter<any> = new EventEmitter;

    @Output()
    toggleFeaturedArticle: EventEmitter<any> = new EventEmitter;

    private _lastTop: number;

    constructor(public videoPlayerService: VideoPlayerService, @Inject(DOCUMENT) public doc: Document) {
    }

    ngOnInit(): void {
        this._lastTop = this.doc.body.scrollTop;
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        let top = jQuery(document).scrollTop();
        if (top > 100) {
            if (this._lastTop > top) {
                jQuery('.vi-article-header-info').removeClass('vi-fixed-2').addClass('vi-fixed-1');
            } else {
                jQuery('.vi-article-header-info').removeClass('vi-fixed-1').addClass('vi-fixed-2');
            }
        } else {
            jQuery('.vi-article-header-info').removeClass('vi-fixed-1').removeClass('vi-fixed-2');
        }

        this._lastTop = top;
    }
}