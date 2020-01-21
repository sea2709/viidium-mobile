import {OnInit, ElementRef, ViewChild, Component} from '@angular/core';
import {PhotoService} from '../../../../services/photo.service';
import {PhotoSet} from '../../../../models/photoset.model';
import {StringUtilities} from '../../../../utilities/string';
import {Router} from '@angular/router';
import {SlugifyPipe} from '../../../../pipes/slugify.pipe';

declare let jQuery: any;

@Component({
    selector: 'photos',
    templateUrl: 'photos.component.html',
    styleUrls: ['./photos.component.scss']
})

export class PhotosComponent implements OnInit {
    public numberOfPhotos: number;
    public photoSets: PhotoSet[];
    public deviceWidth: number;

    @ViewChild('photoCarousel')
    private _photoCarousel: ElementRef;

    @ViewChild('photoCarouselFrame')
    private _photoCarouselFrame: ElementRef;

    constructor(private _photoService: PhotoService, private _router: Router,
                public stringUtilities: StringUtilities, private _slugify: SlugifyPipe) {
    }

    ngOnInit(): void {
        this.deviceWidth = window.screen.width;
        this.numberOfPhotos = Math.round(Math.random()) + 4;

        this._photoService.getLatestPhotoSets(0, this.numberOfPhotos).subscribe({
            next: response => {
                this.photoSets = response.photoSets;
                if (this.photoSets.length > 0) {
                    setTimeout(() => {
                        if (this._photoCarousel) {
                            jQuery(this._photoCarousel.nativeElement).on('init', (event, slick) => {
                                let slideWidth = slick.$slides[slick.currentSlide].offsetWidth - 40;
                                jQuery(this._photoCarouselFrame.nativeElement).css('width', slideWidth + 'px');
                            });

                            jQuery(this._photoCarousel.nativeElement).find('> li').css('width', (this.deviceWidth - 40) + 'px');

                            jQuery(this._photoCarousel.nativeElement).slick({
                                centerMode: true,
                                dots: true,
                                arrows: true
                            });
                        }

                        if (this._photoCarouselFrame) {
                            jQuery(this._photoCarouselFrame.nativeElement).on('click', () => {
                                let currentSlide = jQuery(this._photoCarousel.nativeElement).slick('slickCurrentSlide');
                                this._router.navigate(['/photos', this.photoSets[currentSlide].id,
                                    this._slugify.transform(this.photoSets[currentSlide].name)]);
                            });
                        }
                    });
                }
            }
        });
    }
}