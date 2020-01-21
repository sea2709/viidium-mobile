import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomePageComponent} from 'app/pages/home/home-page.component';
import {HomePageModule} from './pages/home/home-page.module';
import {CategoryPageComponent} from './pages/category/category-page.component';
import {CategoryPageModule} from './pages/category/category-page.module';
import {ArticlePageComponent} from './pages/article/article-page.component';
import {ArticlePageModule} from './pages/article/article-page.module';
import {NotFoundPageComponent} from './pages/not-found/not-found-page.component';
import {NotFoundPageModule} from './pages/not-found/not-found-page.module';
import {SearchPageComponent} from './pages/search/search-page.component';
import {SearchPageModule} from './pages/search/search-page.module';
import {CategoriesPageComponent} from './pages/categories/categories-page.component';
import {CategoriesPageModule} from './pages/categories/categories-page.module';
import {CollectionsPageComponent} from './pages/collections/collections-page.component';
import {CollectionsPageModule} from './pages/collections/collections-page.module';
import {CollectionPageComponent} from './pages/collection/collection-page.component';
import {CollectionPageModule} from './pages/collection/collection-page.module';
import {PhotosPageModule} from './pages/photos/photos-page.module';
import {VideosPageModule} from './pages/videos/videos-page.module';
import {VideosPageComponent} from './pages/videos/videos-page.component';
import {PhotosPageComponent} from './pages/photos/photos-page.component';
import {PhotoSetPageComponent} from './pages/photo-set/photo-set-page.component';
import {PhotoSetPageModule} from './pages/photo-set/photo-set-page.module';
import {TrendingPageComponent} from './pages/trending/trending-page.component';
import {TrendingPageModule} from './pages/trending/trending-page.module';
import {HomepageResolve} from './services/homepage.resolve.service';
import {HttpClientModule} from '@angular/common/http';
import {ProfilePageComponent} from './pages/profile/profile-page.component';
import {ProfilePageModule} from './pages/profile/profile-page.module';
import {RegisterPageComponent} from './pages/register/register-page.component';
import {RegisterPageModule} from './pages/register/register-page.module';
import {EditProfilePageComponent} from './pages/edit-profile/edit-profile-page.component';
import {EditProfilePageModule} from './pages/edit-profile/edit-profile-page.module';
import {AuthGuard} from './services/auth-guard.service';
import {GuestAuthGuard} from './services/guest-auth-guard.service';
import {PendingSubmissionsPageComponent} from './pages/pending-submissions/pending-submissions-page.component';
import {EditorAuthGuard} from './services/editor-auth-guard.service';
import {PendingSubmissionsPageModule} from './pages/pending-submissions/pending-submissions-page.module';
import {ForgotPasswordPageComponent} from './pages/forgot-password/forgot-password-page.component';
import {ForgotPasswordPageModule} from './pages/forgot-password/forgot-password-page.module';
import {ForgotStartPageComponent} from './pages/forgot-password/start/start-page.component';
import {ForgotStartPageModule} from './pages/forgot-password/start/start-page.module';
import {ForgotUpdatePageComponent} from './pages/forgot-password/update/update-page.component';
import {ForgotUpdatePageModule} from './pages/forgot-password/update/update-page.module';
import {HighlightsPageComponent} from './pages/highlights/highlights-page.component';
import {HighlightsPageModule} from './pages/highlights/highlights-page.module';
import {FeaturedPageComponent} from './pages/featured/featured-page.component';
import {FeaturedPageModule} from './pages/featured/featured-page.module';
import { AdminAuthGuard } from './services/admin-auth-guard.service';

const routes: Routes = [
    {path: '', component: HomePageComponent, resolve: {groups: HomepageResolve}},
    {path: 'trending', component: TrendingPageComponent},
    {path: 'our-picks', component: HighlightsPageComponent},
    {path: 'featured', component: FeaturedPageComponent},
    {path: 'categories', component: CategoriesPageComponent},
    {path: 'categories/:categoryId/:slug', component: CategoryPageComponent},
    {path: 'collections', component: CollectionsPageComponent},
    {path: 'collections/:collectionId/:slug', component: CollectionPageComponent},
    {path: 'article/:articleId/:slug', component: ArticlePageComponent},
    {path: 'videos', component: VideosPageComponent},
    {path: 'photos', component: PhotosPageComponent},
    {path: 'photos/:photoSetId/:slug', component: PhotoSetPageComponent},
    {path: 'search', component: SearchPageComponent},
    {path: 'profile/:username', component: ProfilePageComponent},
    {path: 'edit-profile', component: EditProfilePageComponent, canActivate: [AuthGuard]},
    {path: 'register/:regCode', component: RegisterPageComponent, canActivate: [GuestAuthGuard]},
    {
        path: 'forgot-password',
        component: ForgotPasswordPageComponent,
        canActivate: [GuestAuthGuard],
        children: [
            {path: '', component: ForgotStartPageComponent},
            {path: 'update/:userId/:timestamp/:hash', component: ForgotUpdatePageComponent},
        ]
    },
    {path: 'pending-submissions', component: PendingSubmissionsPageComponent, canActivate: [EditorAuthGuard]},
    {path: '**', component: NotFoundPageComponent},
    {path: 'not-found', component: NotFoundPageComponent}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        HomePageModule,
        HighlightsPageModule,
        FeaturedPageModule,
        CategoryPageModule,
        ArticlePageModule,
        NotFoundPageModule,
        SearchPageModule,
        CategoriesPageModule,
        CollectionsPageModule,
        CollectionPageModule,
        VideosPageModule,
        PhotosPageModule,
        PhotoSetPageModule,
        TrendingPageModule,
        ProfilePageModule,
        EditProfilePageModule,
        RegisterPageModule,
        ForgotPasswordPageModule,
        ForgotStartPageModule,
        ForgotUpdatePageModule,
        PendingSubmissionsPageModule,
        HttpClientModule
    ],
    exports: [RouterModule],
    providers: [HomepageResolve]
})

export class AppRoutingModule {
}
