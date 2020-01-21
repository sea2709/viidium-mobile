import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {SettingService} from './setting.service';
import {PhotoSet} from '../models/photoset.model';
import {Photo} from '../models/photo.model';
import {Article} from '../models/article.model';
import {HttpClient} from '@angular/common/http';
import {GetPhotoSetsResponse} from './responses/getPhotoSets.response';

@Injectable()
export class PhotoService {
    constructor(private _http: HttpClient, private _settingService: SettingService) {}

    getLatestPhotoSets(from: number = 0, limit: number = 5): Observable<GetPhotoSetsResponse> {
        return this._http.get(this._settingService.getApiUrl() + '/viidia/api/getLatestPhotoSets/' + from + '/' + limit)
            .map((response: {data: any, total: number}) => {
                let photoSets = [];

                for (let obj of response.data) {
                    let photos = [];
                    for (let imgObj of obj.images) {
                        photos.push(new Photo(imgObj));
                    }
                    obj.photos = photos;
                    photoSets.push(new PhotoSet(obj));
                }

                return <GetPhotoSetsResponse>{
                    photoSets: photoSets,
                    total: response.total
                };
            });
    }

    getPhotoSetById(id: number): Observable<PhotoSet> {
        return this._http.get(this._settingService.getApiUrl() + '/viidia/api/getPhotoSetById/' + id)
            .map((response: {data: any}) => response.data)
            .map((response: {images: any, article: any, sourceArticle: any, photos: any}) => {
                let photos = [];
                for (let imgObj of response.images) {
                    photos.push(new Photo(imgObj));
                }
                response.photos = photos;
                if (response.article) {
                    response.sourceArticle = new Article(response.article);
                }

                return new PhotoSet(response);
            });
    }

    getPrevAndNextPhotoSet(id: number): Observable<any> {
        return this._http.get(this._settingService.getApiUrl()
            + '/viidia/api/getPrevAndNextPhotoSet/' + id)
            .map((response: {data: any}) => {
                const responseData = response.data;

                let prev = null;
                let next = null;
                if (responseData.prev) {
                    prev = new PhotoSet(responseData.prev);
                }
                if (responseData.next) {
                    next = new PhotoSet(responseData.next);
                }
                return {
                    prev: prev,
                    next: next
                }
            });
    }
}
