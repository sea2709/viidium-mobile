import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {HighlightsPageComponent} from './highlights-page.component';
import {ViidiaCommonComponentsModule} from '../../components/viidia-common-components.module';
import { ViidiaCommonPipesModule } from 'app/pipes/viidia-common-pipes.module';

@NgModule({
    declarations: [
        HighlightsPageComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ViidiaCommonComponentsModule,
        ViidiaCommonPipesModule
    ],
    exports: [
        HighlightsPageComponent
    ],
    providers: []
})

export class HighlightsPageModule {
}
