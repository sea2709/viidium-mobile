import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {CategoryPageComponent} from './category-page.component';
import {ViidiaCommonPipesModule} from '../../pipes/viidia-common-pipes.module';
import {ViidiaCommonComponentsModule} from '../../components/viidia-common-components.module';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';

@NgModule({
    declarations: [
        CategoryPageComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ViidiaCommonPipesModule,
        InfiniteScrollModule,
        ViidiaCommonComponentsModule
    ],
    exports: [
        CategoryPageComponent
    ],
    providers: []
})

export class CategoryPageModule {
}
