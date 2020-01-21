import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ViidiaCommonPipesModule} from '../../pipes/viidia-common-pipes.module';
import {StringUtilities} from '../../utilities/string';
import {SlugifyPipe} from '../../pipes/slugify.pipe';
import {ShareButtonsModule} from 'ngx-sharebuttons';
import {ViidiaCommonComponentsModule} from '../../components/viidia-common-components.module';
import {ViidiaCommonDirectivesModule} from '../../directives/viidia-common-directives.module';
import {TrendingPageComponent} from './trending-page.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';

@NgModule({
    declarations: [
        TrendingPageComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ShareButtonsModule.forRoot(),
        ViidiaCommonComponentsModule,
        ViidiaCommonDirectivesModule,
        InfiniteScrollModule,
        ViidiaCommonPipesModule
    ],
    exports: [
        TrendingPageComponent
    ],
    providers: [StringUtilities, SlugifyPipe]
})

export class TrendingPageModule {
}
