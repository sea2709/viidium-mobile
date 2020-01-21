import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ViidiaCommonPipesModule} from '../../pipes/viidia-common-pipes.module';
import {SearchPageComponent} from './search-page.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';

@NgModule({
    declarations: [
        SearchPageComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ViidiaCommonPipesModule,
        InfiniteScrollModule,
        NgxPaginationModule
    ],
    exports: [
        SearchPageComponent
    ],
    providers: []
})

export class SearchPageModule {
}
