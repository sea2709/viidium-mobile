import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {SettingService} from './setting.service';
import {ArticleService} from './article.service';
import {Group} from '../models/group.model';
import {HttpClient} from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Category } from 'app/models/category.model';
import { Article } from 'app/models/article.model';
import { Subject } from 'rxjs';

declare let moment: any;

@Injectable()
export class GroupService {
    public cachedGroups: Group[] = [];
    public cachedCategoriesWithIndexKey: Category[] = null;

    private _updatedGroup = new Subject<Group>();
    public updatedGroup$ = this._updatedGroup.asObservable();

    constructor(private _http: HttpClient, private _settingService: SettingService, 
        private _articleService: ArticleService, private _domSanitizer: DomSanitizer) {
        this._articleService.getArticleCategories().subscribe(categories => this.cachedCategoriesWithIndexKey = categories);
    }

    load(): Promise<any> {
        if (this._settingService.configurations['group_special_in_day']) {
            return this.getGroupById(this._settingService.configurations['group_special_in_day']).toPromise();
        }
    }

    getGroups(excludeGroupIds: number[] = []): Observable<Group[]> {
        return this._http.get(this._settingService.getApiUrl() + '/viidia/api/getGroups/')
            .map((response: {data: any}) => {
                let groups = [];

                for (let obj of response.data) {
                    if (excludeGroupIds.indexOf(obj.id) == -1) {
                        const articles = [];
                        for (const articleObj of obj.articles) {
                            articles.push(this._articleService.buildArticleFromJsonObject(articleObj));
                        }
                        obj.articles = articles;
                        const group = new Group(obj);
                        this.cachedGroups[group.id] = group;
                        groups[group.id] = group;
                    }
                }

                return groups;
            });
    }

    getGroupById(groupId: number): Observable<Group> {
        if (this.cachedGroups[groupId]) {
            return Observable.create(observer => {
                observer.next(this.cachedGroups[groupId]);
                observer.complete();
            });
        }
        return this._http.get(this._settingService.getApiUrl() + '/viidia_article/group/' + groupId + '?_format=json')
            .map((response: any) => {
                if (response.nid) {
                    const groupObj = {};
                    groupObj['id'] = response.nid[0].value;
                    groupObj['isRelatedGroup'] = response.field_is_related_group[0].value;

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
                    groupObj['articles'] = articles;

                    this.cachedGroups[groupId] = new Group(groupObj);

                    return this.cachedGroups[groupId];
                }

                return null;
            });
    }

    addArticleToGroup(groupId: number, article: Article): Observable<any> {
        return this._http.post(this._settingService.getApiUrl() + '/viidia_article/group/' + groupId, {
            action: 'add-article',
            article_id: article.id
        }).map((response: any) => {
            if (response.nid) {
                const groupObj = {};
                groupObj['id'] = response.nid[0].value;
                groupObj['isRelatedGroup'] = response.field_is_related_group[0].value;

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
                groupObj['articles'] = articles;

                this.cachedGroups[groupId] = new Group(groupObj);

                this._updatedGroup.next(this.cachedGroups[groupId]);

                if (groupId == this._settingService.configurations['featured_group']) {
                    const article = this.cachedGroups[groupId].articles[0];
                    this._articleService.addFeaturedArticle(article);
                } else  {
                    if (groupId == this._settingService.configurations['group_special_in_day']) {
                        this._articleService.removeArticleFromLatest(article.id);
                    }
                }

                return this.cachedGroups[groupId];
            }

            return null;
        });
    }

    removeArticleFromGroup(groupId: number, article: Article): Observable<any> {
        return this._http.post(this._settingService.getApiUrl() + '/viidia_article/group/' + groupId, {
            action: 'remove-article',
            article_id: article.id
        }).map((response: any) => {
            if (response.nid) {
                const groupObj = {};
                groupObj['id'] = response.nid[0].value;
                groupObj['isRelatedGroup'] = response.field_is_related_group[0].value;

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
                groupObj['articles'] = articles;

                this.cachedGroups[groupId] = new Group(groupObj);

                this._updatedGroup.next(this.cachedGroups[groupId]);

                if (groupId == this._settingService.configurations['featured_group']) {
                    this._articleService.removeFeaturedArticle(article.id);
                } else  {
                    if (groupId == this._settingService.configurations['group_special_in_day']) {
                        this._articleService.addArticleToLatest(article);
                    }
                }

                return this.cachedGroups[groupId];
            }

            return null;
        });
    }
}
