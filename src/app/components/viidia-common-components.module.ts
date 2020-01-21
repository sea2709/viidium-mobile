import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ViidiaCommonPipesModule} from '../pipes/viidia-common-pipes.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CategoryComponent} from './category/category.component';
import {SharesComponent} from './shares/shares.component';
import {ShareButtonsModule} from 'ngx-sharebuttons';
import {ModalModule} from 'ngx-bootstrap';
import {SubmitArticleModalComponent} from './submit-article-modal/submit-article-modal.component';
import {ViidiaHeaderComponent} from './viidia-header/viidia-header.component';
import {InviteFriendModalComponent} from './invite-friend-modal/invite-friend-modal.component';
import {ViidiaAlertComponent} from './viidia-alert/viidia-alert.component';
import {GroupComponent} from './group/group.component';
import {CollectionsComponent} from './collections/collections.component';
import {ContactModalComponent} from './contact-modal/contact-modal.component';
import { ViidiaFooterComponent } from './viidia-footer/viidia-footer.component';
import { ArticleActionsComponent } from './article-actions/article-actions.component';

@NgModule({
    declarations: [
        CategoryComponent,
        SharesComponent,
        ViidiaHeaderComponent,
        ViidiaFooterComponent,
        SubmitArticleModalComponent,
        ContactModalComponent,
        InviteFriendModalComponent,
        ViidiaAlertComponent,
        GroupComponent,
        CollectionsComponent,
        ArticleActionsComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ShareButtonsModule.forRoot(),
        ViidiaCommonPipesModule,
        ModalModule.forRoot(),
        ReactiveFormsModule
    ],
    exports: [
        CategoryComponent,
        SharesComponent,
        ViidiaHeaderComponent,
        ViidiaFooterComponent,
        SubmitArticleModalComponent,
        InviteFriendModalComponent,
        ViidiaAlertComponent,
        GroupComponent,
        CollectionsComponent,
        ContactModalComponent,
        ArticleActionsComponent
    ],
    providers: []
})
export class ViidiaCommonComponentsModule {
}