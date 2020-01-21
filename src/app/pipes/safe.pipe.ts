import {DomSanitizer} from '@angular/platform-browser';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'safe'})
export class SafePipe implements PipeTransform  {
    constructor(private sanitized: DomSanitizer) {}
    transform(url) {
        return this.sanitized.bypassSecurityTrustResourceUrl(url);
    }
}