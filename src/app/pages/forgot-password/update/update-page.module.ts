import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {ForgotUpdatePageComponent} from './update-page.component';
import {ViidiaCommonDirectivesModule} from '../../../directives/viidia-common-directives.module';
import {ViidiaCommonComponentsModule} from '../../../components/viidia-common-components.module';

@NgModule({
    declarations: [
        ForgotUpdatePageComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        ViidiaCommonDirectivesModule,
        ViidiaCommonComponentsModule
    ],
    exports: [
        ForgotUpdatePageComponent
    ],
    providers: []
})

export class ForgotUpdatePageModule {
}
