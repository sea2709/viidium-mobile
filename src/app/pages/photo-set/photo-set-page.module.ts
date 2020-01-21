import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ViidiaCommonPipesModule} from '../../pipes/viidia-common-pipes.module';
import {StringUtilities} from '../../utilities/string';
import {ViidiaCommonComponentsModule} from '../../components/viidia-common-components.module';
import {PhotoSetPageComponent} from './photo-set-page.component';
import {ShareButtonsModule} from 'ngx-sharebuttons';

@NgModule({
    declarations: [
        PhotoSetPageComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        ViidiaCommonPipesModule,
        ViidiaCommonComponentsModule,
        ShareButtonsModule.forRoot(),
    ],
    exports: [
        PhotoSetPageComponent
    ],
    providers: [StringUtilities]
})

export class PhotoSetPageModule {
}
