import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import {SettingService} from './setting.service';
import {Category} from '../models/category.model';
import {Article} from '../models/article.model';
import {GetArticlesResponse} from './responses/getArticles.response';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Source} from '../models/source.model';
import {User} from '../models/user.model';
import { Subject } from 'rxjs';
import { Tag } from 'app/models/tag.model';

declare let moment: any;

@Injectable()
export class ArticleService {
    private _updateLatestArticles = new Subject<Article[]>();
    public updateLatestArticles$ = this._updateLatestArticles.asObservable();

    private _updateFeaturedArticles = new Subject<Article[]>();
    public updateFeaturedArticles$ = this._updateFeaturedArticles.asObservable();

    public cachedCategories: Category[] = null;
    public cachedCategoriesWithIndexKey: Category[] = null;
    public featuredArticles: Article[] = null;
    public latestArticles: Article[] = [];

    public previousPage = null;

    constructor(private _http: HttpClient,
                private _settingService: SettingService,
                private _domSanitizer: DomSanitizer) {
    }

    private _buildArticlesFromJsonObjects(jsonObjects): Article[] {
        let articles = [];

        for (const obj of jsonObjects) {
            articles.push(this.buildArticleFromJsonObject(obj));
        }

        return articles;
    }
    
    parseArticle(articleResponseData: any): Article {
        const articleData = {
            id: articleResponseData.nid[0].value,
            name: articleResponseData.title[0].value,
            body: articleResponseData.body[0] ? articleResponseData.body[0].value : null,
            summary: articleResponseData.body[0] ? articleResponseData.body[0].summary : null,
            image: articleResponseData.field_image[0] ? articleResponseData.field_image[0].url : null,
            teaserImage: articleResponseData.field_teaser_image[0] ? articleResponseData.field_teaser_image[0].url : null,
            category: articleResponseData.field_category[0] ?
                this.cachedCategoriesWithIndexKey[articleResponseData.field_category[0].target_id] : null,
            sourceUrl: articleResponseData.field_source_url[0] ? articleResponseData.field_source_url[0].uri : null,
            videoHtml: articleResponseData.field_video_html[0] ?
                this._domSanitizer.bypassSecurityTrustHtml(articleResponseData.field_video_html[0].value) : null,
            createdDate: moment.unix(articleResponseData.created[0].value).toDate(),
            externalReferral: articleResponseData.field_external_referral[0].value,
            articleSource: null,
            curatedBy: null,
            publishedBy: null,
            contributedBy: null
        }
        
        return new Article(articleData);        
    }

    loadArticleCategories(): Promise<any> {
        const o1 = this.getArticleCategories();
        return o1.toPromise();
    }

    loadFeaturedArticles(): Promise<any> {
        const o2 = this.getFeaturedArticles();
        return o2.toPromise();
    }

    getFeaturedArticles(): Observable<Article[]> {
        if (this.featuredArticles === null) {
            if (this._settingService.configurations['featured_group']) {
                return this._http.get(this._settingService.getApiUrl() + '/viidia_article/group/' + this._settingService.configurations['featured_group'] + '?_format=json')
                    .map((response: any) => {
                        if (response.nid) {
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
                            this.featuredArticles = articles;

                            return this.featuredArticles;
                        }
                });
            }
        } else {
            return Observable.create(observer => {
                observer.next(this.featuredArticles);
                observer.complete();
            });
        }
    }

    getArticleCategories(): Observable<Category[]> {
        if (this.cachedCategories === null) {
            return this._http.get(this._settingService.getApiUrl() + '/viidia/api/getArticleCategories')
                .map(jsonObject => {
                    this.cachedCategories = [];
                    this.cachedCategoriesWithIndexKey = [];
                    this.cachedCategories = Object.keys(jsonObject).map(key => new Category(jsonObject[key]));
                    let keys = Object.keys(jsonObject);
                    for (let key in keys) {
                        let idx = keys[key];
                        this.cachedCategoriesWithIndexKey[idx] = new Category(jsonObject[idx]);
                    }

                    return this.cachedCategories;
                });
        }
        else {
            return Observable.create(observer => {
                observer.next(this.cachedCategories);
                observer.complete();
            });
        }
    }

    getLatestArticles(from: number = 0, limit: number = 5, excludeArticleIds: number[] = [], forceUpdate = false): Observable<GetArticlesResponse> {
        if (from + limit > this.latestArticles.length || forceUpdate) {
            let params = new HttpParams();
            if (excludeArticleIds && excludeArticleIds.length > 0) {
                for (let i = 0; i < excludeArticleIds.length; i++) {
                    params = params.set('excludeArticleIds[' + i + ']', String(excludeArticleIds[i]));
                }
            }
            return this._http.get(this._settingService.getApiUrl()
                + '/viidia/api/getLatestArticles/' + from + '/' + limit + '/', {params: params})
                .map((response: {data: any, total: number}) => {
                    const articles = this._buildArticlesFromJsonObjects(response.data);
                    let idx = from;
                    for (const a of articles) {
                        if (typeof this.latestArticles[idx] === 'undefined') {
                            this.latestArticles.push(a);
                        } else {
                            this.latestArticles[idx] = a;
                        }
                        idx++;
                    }

                    return <GetArticlesResponse>{
                        articles: articles,
                        total: response.total
                    };
            });
        } else {
            return Observable.create(observer => {
                observer.next(<GetArticlesResponse>{
                    articles: this.latestArticles.slice(from, from + limit)
                });
                observer.complete();
            });
        }
        
    }

    addArticleToLatest(addedArticle: Article) {
        this.latestArticles.unshift(addedArticle);
        this._updateLatestArticles.next(this.latestArticles);
    }
    
    removeArticleFromLatest(removedArticleId: number) {
        const oldLatestArticlesCount = this.latestArticles.length;
        let updatedIndex = -1;
        this.latestArticles = this.latestArticles.filter((article, index) => {
            if (article.id == removedArticleId) {
                updatedIndex = index;
            }
            return article.id != removedArticleId
        });
        const newLatestArticlesCount = this.latestArticles.length;

        if (oldLatestArticlesCount != newLatestArticlesCount) {
            this._updateLatestArticles.next(this.latestArticles);
        }
    }

    getArticlesByCategory(categoryId: number, pageNumber: number = 1, articlesPerPage: number = 10): Observable<GetArticlesResponse> {
        return this._http.get(this._settingService.getApiUrl()
            + '/viidia/api/getArticlesByCategory/' + categoryId + '/' + pageNumber + '/' + articlesPerPage)
            .map((jsonObject: {data: any, total: number}) => {
                return <GetArticlesResponse>{
                    articles: this._buildArticlesFromJsonObjects(jsonObject.data),
                    total: jsonObject.total
                };
            });
    }

    getPrevArticlesInCategory(articleId: number, categoryId: number, numberOfArticles: number = 5): Observable<Article[]> {
        return this._http.get(this._settingService.getApiUrl()
            + '/viidia/api/getPrevArticlesInCategory/' + articleId + '/' + categoryId + '/' + numberOfArticles)
            .map((jsonObject: {data: any}) => {
                return this._buildArticlesFromJsonObjects(jsonObject.data);
            });
    }

    getNextArticlesInCategory(articleId: number, categoryId: number, numberOfArticles: number = 5): Observable<Article[]> {
        return this._http.get(this._settingService.getApiUrl()
            + '/viidia/api/getNextArticlesInCategory/' + articleId + '/' + categoryId + '/' + numberOfArticles)
            .map((jsonObject: {data: any}) => {
                return this._buildArticlesFromJsonObjects(jsonObject.data);
            });
    }

    getArticleById(articleId: number): Observable<Article> {
        let featuredArticleIds = [];
        if (this.featuredArticles) {
            featuredArticleIds = this.featuredArticles.map(article => article.id);
        }
        
        return this._http.get(this._settingService.getApiUrl() + '/viidia_article/article/' + articleId + '/?_format=json')
            .map((response: any) => {
                const articleData = {
                    id: response.article.nid[0].value,
                    name: response.article.title[0].value,
                    body: response.article.body[0].value,
                    processed: response.article.body[0].processed,
                    summary: response.article.body[0].summary,
                    image: response.article.field_image[0] ? response.article.field_image[0].url : null,
                    teaserImage: response.article.field_teaser_image[0] ? response.article.field_teaser_image[0].url : null,
                    category: response.article.field_category[0] ?
                        this.cachedCategoriesWithIndexKey[response.article.field_category[0].target_id] : null,
                    sourceUrl: response.article.field_source_url[0] ? response.article.field_source_url[0].uri : null,
                    videoHtml: response.article.field_video_html[0] ?
                        this._domSanitizer.bypassSecurityTrustHtml(response.article.field_video_html[0].value) : null,
                    createdDate: moment.unix(response.article.created[0].value).toDate(),
                    externalReferral: response.article.field_external_referral[0].value,
                    articleSource: null,
                    curatedBy: null,
                    publishedBy: null,
                    contributedBy: null,
                    featured: featuredArticleIds.indexOf(response.article.nid[0].value) > -1,
                    tags: null
                }

                if (response.source) {
                    articleData.articleSource = new Source({
                        id: response.source.nid[0].value,
                        name: response.source.title[0].value,
                        redirect: response.source.field_redirect[0] ? response.source.field_redirect[0].value : false,
                    });
                }

                if (response.curator) {
                    articleData.curatedBy = new User({
                        id: response.curator.uid[0].value,
                        username: response.curator.name[0].value,
                        name: response.curator.field_name[0].value,
                        image: response.curator.user_picture[0] ? response.curator.user_picture[0].url : null,
                        userPictureId: response.curator.user_picture[0] ? response.curator.user_picture[0].target_id : null,
                        coverPhoto: response.curator.field_cover_photo[0] ? response.curator.field_cover_photo[0].url : null,
                        coverPhotoId: response.curator.field_cover_photo[0] ? response.curator.field_cover_photo[0].target_id : null,
                    });
                }
                if (response.publisher) {
                    articleData.publishedBy = new User({
                        id: response.publisher.uid[0].value,
                        username: response.publisher.name[0].value,
                        name: response.publisher.field_name[0].value,
                        image: response.publisher.user_picture[0] ? response.publisher.user_picture[0].url : null,
                        userPictureId: response.publisher.user_picture[0] ? response.publisher.user_picture[0].target_id : null,
                        coverPhoto: response.publisher.field_cover_photo[0] ? response.publisher.field_cover_photo[0].url : null,
                        coverPhotoId: response.publisher.field_cover_photo[0] ? response.publisher.field_cover_photo[0].target_id : null,
                    });
                }
                if (response.contributor) {
                    articleData.contributedBy = new User({
                        id: response.contributor.uid[0].value,
                        username: response.contributor.name[0].value,
                        name: response.contributor.field_name[0].value,
                        image: response.contributor.user_picture[0] ? response.contributor.user_picture[0].url : null,
                        userPictureId: response.contributor.user_picture[0] ? response.contributor.user_picture[0].target_id : null,
                        coverPhoto: response.contributor.field_cover_photo[0] ? response.contributor.field_cover_photo[0].url : null,
                        coverPhotoId: response.contributor.field_cover_photo[0] ? response.contributor.field_cover_photo[0].target_id : null,
                    });
                }

                if (response.article.tags) {
                    const tags = [];
                    response.article.tags.forEach(tag => {
                        tags.push(new Tag({id: tag.tid[0].value, name: tag.name[0].value}));
                    });
                    articleData.tags = tags;
                }

                return new Article(articleData);
            });
    }

    getNextArticleById(articleId: number): Observable<Article> {
        return this._http.get(this._settingService.getApiUrl() + '/viidia/api/getNextArticlesById/' + articleId)
            .map((response: {data: any}) => {
                return this.buildArticleFromJsonObject(response.data ? response.data[0] : null);
            });
    }

    getPreviousArticleById(articleId: number): Observable<Article> {
        return this._http.get(this._settingService.getApiUrl() + '/viidia/api/getPreviousArticlesById/' + articleId)
            .map((response: {data: any}) => {
                return this.buildArticleFromJsonObject(response.data ? response.data[0] : null);
            });
    }

    getTrendingArticles(pageNumber: number = 1, articlesPerPage: number = 20): Observable<{total: number, articles: Article[]}> {
        return this._http.get(this._settingService.getApiUrl() + '/viidia/api/getTrendingArticles/' + pageNumber + '/' + articlesPerPage)
            .map((response: {data: any, total: number}) => {
                return {
                    total: response.total,
                    articles: this._buildArticlesFromJsonObjects(response.data)
                }
            });
    }

    hitArticle(articleId: number): Observable<Object> {
        return this._http.get(this._settingService.getApiUrl() + '/viidia/api/hitArticle/' + articleId);
    }

    searchArticles(query: string, tag: string, pageNumber: number = 1, articlesPerPage: number = 20): Observable<GetArticlesResponse> {
        let params = new HttpParams();
        if (query) {
            params = params.set('query', query);
        }
        if (tag) {
            params = params.set('tag', tag);
        }
        
        return this._http.get(this._settingService.getProductionApiUrl()
            + '/viidia/api/searchArticles/' + pageNumber + '/' + articlesPerPage, {params: params})
            .map((response: {data: any, total: number}) => {
                return <GetArticlesResponse>{
                    articles: this._buildArticlesFromJsonObjects(response.data),
                    total: response.total
                };
            });
    }

    getSubmittedArticles(userId: number, pageNumber: number, articlesPerPage: number = 20, statuses: string[]): Observable<GetArticlesResponse> {
        let params = new HttpParams();
        params = params.set('_format', 'json')
            .set('page', pageNumber.toString())
            .set('articlesperPage', articlesPerPage.toString());

        for (let idx in statuses) {
            params = params.set('status[' + idx + ']', statuses[idx]);
        }

        return this._http.get(this._settingService.getApiUrl() + '/viidia_article/submitted_articles/' +  userId + '/', {params: params})
            .map((response: {articles: any, total: number, articleSources:any}) => {
                const articles: Article[] = [];
                const articleSources: Source[] = [];

                for (let articleSourceId of Object.keys(response.articleSources)) {
                    let articleSource = response.articleSources[articleSourceId];
                    const articleSourceData = {
                        id: articleSourceId,
                        name: articleSource.title[0].value,
                        redirect: articleSource.field_redirect[0].value
                    };
                    articleSources[articleSourceId] = new Source(articleSourceData);
                }

                for (let articleId of Object.keys(response.articles)) {
                    let article = response.articles[articleId];

                    const articleData = {
                        id: article.nid[0].value,
                        name: article.title[0].value,
                        body: article.body[0] ? article.body[0].value : '',
                        summary: article.body[0] ? article.body[0].summary : '',
                        image: article.field_image[0] ? article.field_image[0].url : null,
                        teaserImage: article.field_teaser_image[0] ? article.field_teaser_image[0].url : null,
                        category: article.field_category[0] ? this.cachedCategoriesWithIndexKey[article.field_category[0].target_id] : null,
                        sourceUrl: article.field_source_url[0].uri,
                        videoHtml: article.field_video_html[0] ?
                            this._domSanitizer.bypassSecurityTrustHtml(article.field_video_html[0].value) : '',
                        createdDate: moment.unix(article.created[0].value).toDate(),
                        externalReferral: article.field_external_referral[0].value,
                        articleSource: article.field_article_source[0] ?
                            articleSources[article.field_article_source[0].target_id] : null,
                        curatedByUserId: article.field_curated_by[0] ? article.field_curated_by[0].target_id : null,
                        publishedByUserId: article.field_published_by[0] ? article.field_published_by[0].target_id : null,
                        contributedByUserId: article.field_contributed_by[0] ? article.field_contributed_by[0].target_id : null
                    };

                    articles.push(new Article(articleData));
                }

                return <GetArticlesResponse>{
                    articles: articles,
                    total: response.total
                };
            });
    }

    buildArticleFromJsonObject(jsonObject): Article {
        if (!jsonObject) {
            return null;
        }

        let featuredArticleIds = [];
        if (this.featuredArticles) {
            featuredArticleIds = this.featuredArticles.map(article => article.id);
        }

        jsonObject.category = this.cachedCategoriesWithIndexKey[jsonObject.categoryId];
        if (jsonObject.videoHtml) {
            jsonObject.videoHtml = this._domSanitizer.bypassSecurityTrustHtml(jsonObject.videoHtml);
        }
        if (jsonObject.articleSource) {
            jsonObject.articleSource = new Source(jsonObject.articleSource);
        }

        jsonObject.featured = featuredArticleIds.indexOf(Number(jsonObject.id)) > -1;

        if (jsonObject.tags) {
            const tags = [];
            for (const obj of jsonObject.tags) {
                tags.push(new Tag(obj));
            }
            jsonObject.tags = tags;
        }

        return new Article(jsonObject);
    }

    getSubmittedArticlesInfo(userId: number): Observable<any> {
        return this._http.get(this._settingService.getApiUrl()
            + '/viidia_article/submitted_articles_info/' + this._settingService.getSubmitArticlesFormId() + '/' + userId
            + '/?_format=json');
    }

    getPreviousAndNextArticlesByIdAndPage(articleId: number, page: string, data: any = null): Observable<any> {
        let params = new HttpParams();
        params = params.set('articleId', articleId.toString());
        params = params.set('page', page);

        if (data) {
            params = params.set('data', JSON.stringify(data));
        }

        return this._http.get(this._settingService.getApiUrl() + '/viidia/api/getPreviousAndNextArticlesByIdAndPage/', {params: params})
            .map((response: {data: any}) => {
            const responseData = response.data;

            let prev = null;
            let next = null;
            if (responseData.prev) {
                prev = this.buildArticleFromJsonObject(responseData.prev);
            }
            if (responseData.next) {
                next = this.buildArticleFromJsonObject(responseData.next);
            }
            return {
                prev: prev,
                next: next
            }
        });  
    }

    repostArticle(article: Article): Observable<any> {
        return this._http.post(this._settingService.getApiUrl() + '/viidia_article/article/' + article.id + '?_format=json', {
            'action': 'repost'
        }).map((response: {success: boolean, message: string}) => {
            if (response.success) {
                const idx = this.latestArticles.findIndex(a => a.id == article.id);
                if (idx > -1) {
                    this.latestArticles.splice(idx, 1);
                    this.latestArticles.unshift(article);

                    this._updateLatestArticles.next(this.latestArticles);
                }
            }
            return response;
        });
    }

    addFeaturedArticle(article: Article): void {
        this.featuredArticles.unshift(article);
        this._updateFeaturedArticles.next(this.featuredArticles);
    }

    removeFeaturedArticle(articleId: number): void {
        this.featuredArticles = this.featuredArticles.filter(a => a.id != articleId);
        this._updateFeaturedArticles.next(this.featuredArticles);
    }
}
