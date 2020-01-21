import {OnInit, ElementRef, ViewChild, Component} from '@angular/core';
import {VideoService} from '../../../../services/video.service';
import {Video} from '../../../../models/video.model';
import {StringUtilities} from '../../../../utilities/string';
import {VideoPlayerService} from '../../../../services/video-player.service';

declare let jQuery: any;

@Component({
    selector: 'videos',
    templateUrl: 'videos.component.html',
    styleUrls: ['./videos.component.scss']
})

export class VideosComponent implements OnInit {
    public videos: Video[];

    @ViewChild('videoCarousel')
    private _videoCarousel: ElementRef;

    constructor(private _videoService: VideoService, public videoPlayerService: VideoPlayerService,
                public stringUtilities: StringUtilities) {
    }

    ngOnInit(): void {
        this._videoService.getLatestVideos(3).subscribe({
            next: response => {
                this.videos = response.videos;

                if (this.videos.length > 0) {
                    setTimeout(() => {
                        if (this._videoCarousel) {
                            jQuery(this._videoCarousel.nativeElement).slick({
                                centerMode: true,
                                dots: false,
                                arrows: false
                            });
                        }
                    });
                }
            }
        })
    }
}