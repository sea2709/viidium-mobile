import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ViidiaCommonPipesModule} from '../../pipes/viidia-common-pipes.module';
import {StringUtilities} from '../../utilities/string';
import {SlugifyPipe} from '../../pipes/slugify.pipe';
import {CollectionsPageComponent} from './collections-page.component';
import {ViidiaCommonComponentsModule} from '../../components/viidia-common-components.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        CollectionsPageComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ViidiaCommonPipesModule,
        ViidiaCommonComponentsModule,
        ReactiveFormsModule
    ],
    exports: [
        CollectionsPageComponent
    ],
    providers: [StringUtilities, SlugifyPipe]
})

export class CollectionsPageModule {
}
