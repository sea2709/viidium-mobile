import {NgModule} from '@angular/core';
import {SafeHtmlPipe} from './safehtml.pipe';
import {SlugifyPipe} from './slugify.pipe';
import {SafePipe} from './safe.pipe';

@NgModule({
    declarations: [
        SafeHtmlPipe,
        SlugifyPipe,
        SafePipe
    ],
    exports: [
        SafeHtmlPipe,
        SlugifyPipe,
        SafePipe
    ]
})
export class ViidiaCommonPipesModule {
}