import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {StringUtilities} from '../../utilities/string';
import {CollectionService} from '../../services/collection.service';
import {Collection} from '../../models/collection.model';

@Component({
    selector: 'collections',
    templateUrl: 'collections.component.html',
    styleUrls: ['./collections.component.scss']
})

export class CollectionsComponent implements OnInit {
    @Input()
    public collections: Collection[] = null;

    @Input()
    public collectionWidth = 0;

    @Input()
    public isCollectionPage = false;

    @Input()
    public view: string = 'thumbnail';

    constructor(private _el: ElementRef, private _collectionService: CollectionService, public stringUtilities: StringUtilities) {
    }

    ngOnInit(): void {
        if (this.collections === null) {
            this._collectionService.getCollections().subscribe({
                next: collections => {
                    this.collections = collections;
                }
            });
        }

        setTimeout(() => {
            if (this.collectionWidth === 0) {
                this.collectionWidth = this._el.nativeElement.parentElement.clientWidth / 2;
            }
        });
    }
}
