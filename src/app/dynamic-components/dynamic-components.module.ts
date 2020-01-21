import {NgModule} from '@angular/core';
import {PhotosetComponent} from './photoset/photoset.component';
import {ViidiaCommonPipesModule} from '../pipes/viidia-common-pipes.module';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

@NgModule({
    declarations: [
        PhotosetComponent
    ],
    exports: [
        PhotosetComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ViidiaCommonPipesModule
    ],
    providers: []
})

export class DynamicComponentsModule {
}
