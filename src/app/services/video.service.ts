import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {SettingService} from './setting.service';
import {Video} from '../models/video.model';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class VideoService {
    constructor(private _http: HttpClient, private _settingService: SettingService, private _domSanitizer: DomSanitizer) {}

    getLatestVideos(number: number = 3, pageNumber: number = 1, videosPerPage: number = 10): Observable<any> {
        return this._http.get(this._settingService.getApiUrl() + '/viidia/api/getLatestVideos/'
            + number + '/' + pageNumber + '/' + videosPerPage)
            .map((response: {total: number, data: any}): {total: number, videos: Video[]} => {
                let vis: Video[] = [];

                for (let obj of response.data) {
                    if (obj.videoHtml) {
                        obj.videoHtml = this._domSanitizer.bypassSecurityTrustHtml(obj.videoHtml);
                    }
                    vis.push(new Video(obj));
                }

                return {
                    'total': response.total,
                    'videos': vis
                };
            });
    }
}
