import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class HeaderService {
    public isShowed = false;

    @Output() change: EventEmitter<boolean> = new EventEmitter();

    toggleSearch() {
        this.isShowed = !this.isShowed;
        this.change.emit(this.isShowed);
    }
}