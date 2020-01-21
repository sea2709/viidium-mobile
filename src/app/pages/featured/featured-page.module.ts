import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FeaturedPageComponent} from './featured-page.component';
import {ViidiaCommonComponentsModule} from '../../components/viidia-common-components.module';
import {ViidiaCommonPipesModule} from '../../pipes/viidia-common-pipes.module';

@NgModule({
    declarations: [
        FeaturedPageComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ViidiaCommonComponentsModule,
        ViidiaCommonPipesModule
    ],
    exports: [
        FeaturedPageComponent
    ],
    providers: []
})

export class FeaturedPageModule {
}
