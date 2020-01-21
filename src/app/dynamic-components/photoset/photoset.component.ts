import {Component, Input} from '@angular/core';

@Component({
    selector: 'photoset',
    templateUrl: './photoset.component.html',
    styleUrls: ['./photoset.component.scss']
})
export class PhotosetComponent {
    @Input()
    photoSetId: number;

    @Input()
    count: number;

    @Input()
    thumbnail: string;

    @Input()
    title: string;
}
