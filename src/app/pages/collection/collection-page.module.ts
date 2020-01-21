import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {CollectionPageComponent} from './collection-page.component';
import {ViidiaCommonPipesModule} from '../../pipes/viidia-common-pipes.module';
import {ViidiaCommonComponentsModule} from '../../components/viidia-common-components.module';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        CollectionPageComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ViidiaCommonPipesModule,
        InfiniteScrollModule,
        ViidiaCommonComponentsModule,
        ReactiveFormsModule,
        InfiniteScrollModule
    ],
    exports: [
        CollectionPageComponent
    ],
    providers: []
})

export class CollectionPageModule {
}
