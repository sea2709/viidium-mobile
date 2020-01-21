import {ModuleWithProviders, NgModule} from '@angular/core';
import {ArticleService} from './article.service';
import {SettingService} from './setting.service';
import {MetaService} from './meta.service';
import {PhotoService} from './photo.service';
import {VideoService} from './video.service';
import {CollectionService} from './collection.service';
import {VideoPlayerService} from './video-player.service';
import {GroupService} from './group.service';
import {UserService} from './user.service';
import {AuthService} from './auth.service';
import {JwtHelper} from '../helpers/jwt.helper';
import {AuthGuard} from './auth-guard.service';
import {GuestAuthGuard} from './guest-auth-guard.service';
import {EditorAuthGuard} from './editor-auth-guard.service';
import {AdminAuthGuard} from './admin-auth-guard.service';
import {AlertService} from './alert.service';
import { HeaderService } from './header.service';
import { CategoryControlsService } from './category.controls.service';

@NgModule({})
export class ViidiaServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ViidiaServicesModule,
      providers: [
        AuthGuard, GuestAuthGuard, EditorAuthGuard, AdminAuthGuard, SettingService, ArticleService, PhotoService, VideoService, HeaderService, CategoryControlsService,
        MetaService, VideoPlayerService, CollectionService, GroupService, UserService, AuthService, JwtHelper, AlertService
      ]
    };
  }
}
