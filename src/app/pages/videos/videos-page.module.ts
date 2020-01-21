import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ViidiaCommonPipesModule} from '../../pipes/viidia-common-pipes.module';
import {StringUtilities} from '../../utilities/string';
import {ViidiaCommonComponentsModule} from '../../components/viidia-common-components.module';
import {VideosPageComponent} from './videos-page.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';

@NgModule({
    declarations: [
        VideosPageComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        ViidiaCommonPipesModule,
        ViidiaCommonComponentsModule,
        InfiniteScrollModule
    ],
    exports: [
        VideosPageComponent
    ],
    providers: [StringUtilities]
})

export class VideosPageModule {
}
