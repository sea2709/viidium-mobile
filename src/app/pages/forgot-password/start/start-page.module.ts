import {ForgotStartPageComponent} from './start-page.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {ReCaptchaModule} from 'angular2-recaptcha';
import {ViidiaCommonComponentsModule} from '../../../components/viidia-common-components.module';

@NgModule({
    declarations: [
        ForgotStartPageComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        ReCaptchaModule,
        ViidiaCommonComponentsModule
    ],
    exports: [
        ForgotStartPageComponent
    ],
    providers: []
})

export class ForgotStartPageModule {
}
