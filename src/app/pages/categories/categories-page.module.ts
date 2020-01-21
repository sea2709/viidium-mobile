import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ViidiaCommonPipesModule} from '../../pipes/viidia-common-pipes.module';
import {StringUtilities} from '../../utilities/string';
import {SlugifyPipe} from '../../pipes/slugify.pipe';
import {CategoriesPageComponent} from './categories-page.component';
import {ViidiaCommonComponentsModule} from '../../components/viidia-common-components.module';

@NgModule({
    declarations: [
        CategoriesPageComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        ViidiaCommonPipesModule,
        ViidiaCommonComponentsModule
    ],
    exports: [
        CategoriesPageComponent
    ],
    providers: [StringUtilities, SlugifyPipe]
})

export class CategoriesPageModule {
}
