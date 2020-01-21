import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {SettingService} from './setting.service';
import {Collection} from '../models/collection.model';
import {Article} from '../models/article.model';
import {ArticleService} from './article.service';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Category } from 'app/models/category.model';

declare let moment: any;

@Injectable()
export class CollectionService {
    public cachedCategoriesWithIndexKey: Category[] = null;
    public cachedCollections: Collection[] = null;
    
    constructor(private _http: HttpClient, private _settingService: SettingService, private _articleService: ArticleService,
                private _domSanitizer: DomSanitizer, private _authService: AuthService) {
        this._articleService.getArticleCategories().subscribe(categories => this.cachedCategoriesWithIndexKey = categories);
    }

    getCollections(orderBy: string = '', orderDir: string = '', forceUpdate = false): Observable<Collection[]> {
        if (!forceUpdate && this.cachedCollections != null) {
            return Observable.create(observer => {
                observer.next(this.cachedCollections);
                observer.complete();
            });
        } else {
            let params = new HttpParams();
            params = params.set('order_by', orderBy);
            params = params.set('order_dir', orderDir);
            return this._http.get(this._settingService.getApiUrl() + '/viidia_article/collections/?_format=json', {params: params})
                .map((response: any) => {
                    const collections = [];
                    this.cachedCollections = [];
                    for (let idx of Object.keys(response)) {
                        const obj = response[idx];
                        const collectionData = {
                            id: obj.nid[0].value,
                            name: obj.title[0].value,
                            body: obj.body[0] ? obj.body[0].processed : '',
                            image: obj.image,
                            articles: null,
                            nArticles: obj.n_articles,
                            changed: obj.changed[0].value,
                            isPrivate: obj.field_is_private[0] ? obj.field_is_private[0].value : false,
                            articleIds: obj.articleIds ? obj.articleIds : null
                        }

                        const collection = new Collection(collectionData);
                        this.cachedCollections[collection.id] = collection;
                        collections.push(collection);
                    }

                    return collections;
                });
        }
    }

    getCollectionById(collectionId: number, pageNumber: number = 1, articlesPerPage: number = 20): Observable<Collection> {
        return this._http.get(this._settingService.getApiUrl() + '/viidia_article/collection/' + collectionId 
            + '?_format=json&fetchArticles=1&page=' + pageNumber + '&articlesPerPage=' + articlesPerPage)
            .map((response: any) => {
                const collectionObj = {};
                collectionObj['id'] = response.nid[0].value;
                collectionObj['name'] = response.title[0].value;
                collectionObj['body'] = response.body[0] ? response.body[0].value : null;
                collectionObj['articleIds'] = response.articleIds;
                collectionObj['nArticles'] = response.n_articles;
                collectionObj['changed'] = response.changed[0].value;
                collectionObj['isPrivate'] = response.field_is_private[0] ? response.field_is_private[0].value : null;
                collectionObj['userId'] = response.uid[0].target_id;

                const articles = [];
                    for (const articleObj of response.articles) {
                        const articleData = {
                            id: articleObj.nid[0].value,
                            name: articleObj.title[0].value,
                            body: articleObj.body[0] ? articleObj.body[0].value : null,
                            processed: articleObj.body[0] ? articleObj.body[0].processed : null,
                            summary: articleObj.body[0] ? articleObj.body[0].summary : null,
                            image: articleObj.field_image[0] ? articleObj.field_image[0].url : null,
                            teaserImage: articleObj.field_teaser_image[0] ? articleObj.field_teaser_image[0].url : null,
                            category: articleObj.field_category[0] ?
                                this.cachedCategoriesWithIndexKey[articleObj.field_category[0].target_id] : null,
                            sourceUrl: articleObj.field_source_url[0] ? articleObj.field_source_url[0].uri : null,
                            videoHtml: articleObj.field_video_html[0] ?
                                this._domSanitizer.bypassSecurityTrustHtml(articleObj.field_video_html[0].value) : null,
                            createdDate: moment.unix(articleObj.created[0].value).toDate(),
                            externalReferral: articleObj.field_external_referral[0].value,
                            articleSource: null,
                            curatedBy: null,
                            publishedBy: null,
                            contributedBy: null
                        }
                        articles.push(new Article(articleData));
                    }
                    collectionObj['articles'] = articles;

                return new Collection(collectionObj);
            });
    }

    createCollection(title: string, body: string, is_private: number): Observable<Collection> {
        return this._http.post(this._settingService.getApiUrl() + '/node?_format=json', {
            'title': [{'value': title}],
            'body': {'value': body},
            'type': [{'target_id': 'collection'}],
            'field_is_private': [{'value': is_private}]
        }).map((response: any) => {
            const collectionObj = {
                id: response.nid[0].value,
                name: response.title[0].value,
                body: response.body[0] ? response.body[0].value : null,
                changed: response.changed[0].value,
                isPrivate: response.field_is_private[0] ? response.field_is_private[0].value : null
            };
            return new Collection(collectionObj);
        });
    }

    updateCollection(collectionId: number, title: string, body: string, is_private: number): Observable<Collection> {
        return this._http.patch(this._settingService.getApiUrl() + '/node/' + collectionId + '?_format=json', {
            'title': [{'value': title}],
            'body': {'value': body},
            'type': [{'target_id': 'collection'}],
            'field_is_private': [{'value': is_private}]
        }).map((response: any) => {
            const collectionObj = {
                id: response.nid[0].value,
                name: response.title[0].value,
                body: response.body[0] ? response.body[0].value : null,
                changed: response.changed[0].value,
                isPrivate: response.field_is_private[0] ? response.field_is_private[0].value : null
            };
            
            return new Collection(collectionObj);
        })
    }

    deleteCollection(collectionId: number): Observable<any> {
        return this._http.delete(this._settingService.getApiUrl() + '/node/' + collectionId + '?_format=json');
    }

    assignArticleToCollections(articleId: number, arrCollectionId: number[]): Observable<any> {        
        return this._http.post(this._settingService.getApiUrl() + '/viidia_article/article/' + articleId + '?_format=json', {
            'action': 'add-to-collections',
            'collection_ids': arrCollectionId
        }).map((response: {success: boolean, message: string}) => {
            return response;
        });
    }

    removeArticleFromCollection(articleId: number, collectionId: number): Observable<any> {
        return this._http.post(this._settingService.getApiUrl() + '/viidia_article/collection/' + collectionId + '?_format=json', {
            'action': 'remove-article',
            'article_id': articleId
        }).map((response: {success: boolean, message: string}) => {
            return response;
        });
    }
}
