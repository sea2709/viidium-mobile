import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {RouterModule} from '@angular/router'
import {ArticleService} from './services/article.service';
import {ViidiaServicesModule} from './services/viidia-service.module';
import {CookieModule} from 'ngx-cookie';
import {FormsModule} from '@angular/forms';
import {StoreModule} from '@ngrx/store';
import {appStateReducer} from './reducers/app-state-reducer';
import {ViidiaCommonPipesModule} from './pipes/viidia-common-pipes.module';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {UserService} from './services/user.service';
import {ViidiaCommonComponentsModule} from './components/viidia-common-components.module';
import {HttpModule} from '@angular/http';
import {SettingService} from './services/setting.service';
import { GroupService } from './services/group.service';

export function articleServiceFactory(articleService: ArticleService): Function {
    return () => articleService.loadArticleCategories();
}

export function userServiceFactory(userService: UserService): Function {
    return () => userService.load();
}

export function settingServiceFactory(settingService: SettingService, 
    articleService: ArticleService, groupService: GroupService): Function {
    return () => {
        return new Promise((resolve) => {
            settingService.load().then(() => {
                const p1 = articleService.loadFeaturedArticles();
                const p2 = groupService.load();

                Promise.all([p1, p2]).then(() => {
                    resolve();
                });
            })
        })
    };
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        HttpModule,
        BrowserModule,
        AppRoutingModule,
        RouterModule,
        ViidiaServicesModule.forRoot(),
        CookieModule.forRoot(),
        FormsModule,
        StoreModule.forRoot(appStateReducer),
        ViidiaCommonPipesModule,
        ViidiaCommonComponentsModule,
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: settingServiceFactory,
            deps: [SettingService, ArticleService, GroupService],
            multi: true
        },
        {
            provide: APP_INITIALIZER,
            useFactory: userServiceFactory,
            deps: [UserService],
            multi: true
        },
        {
            provide: APP_INITIALIZER,
            useFactory: articleServiceFactory,
            deps: [ArticleService],
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
