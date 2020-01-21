import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EditProfilePageComponent} from './edit-profile-page.component';
import {Ng2ImgMaxModule} from 'ng2-img-max';
import {ModalModule} from 'ngx-bootstrap';
import {ViidiaCommonComponentsModule} from '../../components/viidia-common-components.module';

@NgModule({
    declarations: [
        EditProfilePageComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        Ng2ImgMaxModule,
        ViidiaCommonComponentsModule,
        ModalModule.forRoot()
    ],
    exports: [
        EditProfilePageComponent
    ],
    providers: []
})

export class EditProfilePageModule {
}
