import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ForgotPasswordPageComponent} from './forgot-password-page.component';

@NgModule({
    declarations: [
        ForgotPasswordPageComponent
    ],
    imports: [
        CommonModule,
        RouterModule
    ],
    exports: [
        ForgotPasswordPageComponent
    ],
    providers: []
})

export class ForgotPasswordPageModule {
}
