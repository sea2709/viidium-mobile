import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {RegisterPageComponent} from './register-page.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        RegisterPageComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule
    ],
    exports: [
        RegisterPageComponent
    ],
    providers: []
})

export class RegisterPageModule {
}
