import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PendingSubmissionsPageComponent} from './pending-submissions-page.component';
import {ModalModule} from 'ngx-bootstrap';
import {LoadingModule} from 'ngx-loading';
import {ViidiaCommonComponentsModule} from '../../components/viidia-common-components.module';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import { ViidiaCommonPipesModule } from 'app/pipes/viidia-common-pipes.module';

@NgModule({
    declarations: [
        PendingSubmissionsPageComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        ModalModule.forRoot(),
        InfiniteScrollModule,
        LoadingModule,
        ViidiaCommonComponentsModule,
        ViidiaCommonPipesModule
    ],
    exports: [
        PendingSubmissionsPageComponent
    ],
    providers: []
})

export class PendingSubmissionsPageModule {
}
