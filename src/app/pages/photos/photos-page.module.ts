import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ViidiaCommonPipesModule} from '../../pipes/viidia-common-pipes.module';
import {StringUtilities} from '../../utilities/string';
import {ViidiaCommonComponentsModule} from '../../components/viidia-common-components.module';
import {PhotosPageComponent} from './photos-page.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';

@NgModule({
    declarations: [
        PhotosPageComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        ViidiaCommonPipesModule,
        ViidiaCommonComponentsModule,
        InfiniteScrollModule
    ],
    exports: [
        PhotosPageComponent
    ],
    providers: [StringUtilities]
})

export class PhotosPageModule {
}
