import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ProfilePageComponent} from './profile-page.component';
import {ViidiaCommonPipesModule} from '../../pipes/viidia-common-pipes.module';
import {ReactiveFormsModule} from '@angular/forms';
import {ModalModule, TabsModule} from 'ngx-bootstrap';
import {ViidiaCommonComponentsModule} from '../../components/viidia-common-components.module';
import {PendingComponent} from './components/pending/pending.component';
import {PostsComponent} from './components/posts/posts.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';

@NgModule({
    declarations: [
        ProfilePageComponent,
        PostsComponent,
        PendingComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ViidiaCommonPipesModule,
        InfiniteScrollModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        ViidiaCommonComponentsModule,
        TabsModule.forRoot()
    ],
    exports: [
        ProfilePageComponent
    ],
    providers: []
})

export class ProfilePageModule {
}
