import {NgModule} from '@angular/core';
import {HomePageComponent} from './home-page.component';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ViidiaCommonPipesModule} from '../../pipes/viidia-common-pipes.module';
import {StringUtilities} from '../../utilities/string';
import {LatestArticelsComponent} from './components/latest-articles/latest-articles.component';
import {Group1Component} from './components/group-1/group-1.component';
import {Group2Component} from './components/group-2/group-2.component';
import {Group3Component} from './components/group-3/group-3.component';
import {Group4Component} from './components/group-4/group-4.component';
import {Group5Component} from './components/group-5/group-5.component';
import {ViidiaCommonComponentsModule} from '../../components/viidia-common-components.module';
import {ShareButtonsModule} from 'ngx-sharebuttons';
import {ViidiaCommonDirectivesModule} from '../../directives/viidia-common-directives.module';
import {PhotosComponent} from './components/photos/photos.component';
import {VideosComponent} from './components/videos/videos.component';
import { ArrUtilities } from 'app/utilities/arr';

@NgModule({
    declarations: [
        HomePageComponent,
        PhotosComponent,
        VideosComponent,
        LatestArticelsComponent,
        Group1Component,
        Group2Component,
        Group3Component,
        Group4Component,
        Group5Component,
    ],
    imports: [
        CommonModule,
        RouterModule,
        ShareButtonsModule.forRoot(),
        ViidiaCommonPipesModule,
        ViidiaCommonComponentsModule,
        ViidiaCommonDirectivesModule
    ],
    exports: [
        HomePageComponent
    ],
    providers: [StringUtilities, ArrUtilities]
})

export class HomePageModule {
}
