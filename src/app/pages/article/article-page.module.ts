import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ViidiaCommonPipesModule} from '../../pipes/viidia-common-pipes.module';
import {ArticlePageComponent} from './article-page.component';
import {OtherCategoriesComponent} from './components/other-categories/other-categories.component';
import {StringUtilities} from '../../utilities/string';
import {ShareButtonsModule} from 'ngx-sharebuttons';
import {Layout1Component} from './components/layout-1/layout-1.component';
import {Layout3Component} from './components/layout-3/layout-3.component';
import {RelatedComponent} from './components/related/related.component';
import {PeopleAreReadingComponent} from './components/people-are-reading/people-are-reading.component';
import {Layout2Component} from './components/layout-2/layout-2.component';
import {ReadNext1Component} from './components/read-next-1/read-next-1.component';
import {ReadNext2Component} from './components/read-next-2/read-next-2.component';
import {ReadNext3Component} from './components/read-next-3/read-next-3.component';
import {ViidiaCommonDirectivesModule} from '../../directives/viidia-common-directives.module';
import {ViidiaCommonComponentsModule} from '../../components/viidia-common-components.module';
import {RelatedUsersComponent} from './components/related-users/related-users.component';
import {ArticleCategoryComponent} from './components/article-category/article-category.component';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ArticlesPanelComponent} from './components/articles-panel/articles-panel.component';
import {RuntimeContentModule} from '../../runtime-content/runtime-content.module';
import {NgMasonryGridModule} from 'ng-masonry-grid';
import { ArticleHeaderComponent } from './components/article-header/article-header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        ArticlePageComponent,
        OtherCategoriesComponent,
        RelatedComponent,
        PeopleAreReadingComponent,
        Layout1Component,
        Layout2Component,
        Layout3Component,
        ReadNext1Component,
        ReadNext2Component,
        ReadNext3Component,
        RelatedUsersComponent,
        ArticleCategoryComponent,
        ArticlesPanelComponent,
        ArticleHeaderComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ViidiaCommonPipesModule,
        ShareButtonsModule.forRoot(),
        ViidiaCommonDirectivesModule,
        ViidiaCommonComponentsModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        RuntimeContentModule,
        NgMasonryGridModule
    ],
    exports: [
        ArticlePageComponent
    ],
    providers: [StringUtilities]
})

export class ArticlePageModule {
}
