import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RuntimeContentComponent} from './runtime-content.component';

@NgModule({
    declarations: [
        RuntimeContentComponent
    ],
    exports: [
        RuntimeContentComponent
    ],
    imports: [
        BrowserModule
    ],
    providers: []
})

export class RuntimeContentModule {
}
