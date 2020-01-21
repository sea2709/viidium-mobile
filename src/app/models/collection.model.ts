import {Article} from './article.model';

export class Collection {
    public name: string;
    public id: number;
    public image: string;
    public body: string;
    public articles: Article[];
    public articleIds: number[];
    public nArticles: number;
    public latestArticles: Article[];
    public changed: number;
    public isPrivate: boolean = false;
    public userId: number;

    constructor(jsonObject) {
        this.id = jsonObject.id;
        this.name = jsonObject.name;
        this.image = jsonObject.image;

        if (jsonObject.articles) {
            this.articles = jsonObject.articles;
        }

        if (jsonObject.nArticles) {
            this.nArticles = jsonObject.nArticles;
        }

        if (jsonObject.latestArticles) {
            this.latestArticles = jsonObject.latestArticles;
        }

        if (jsonObject.body) {
            this.body = jsonObject.body;
        }

        this.changed = jsonObject.changed;

        if (jsonObject.isPrivate) {
            this.isPrivate = jsonObject.isPrivate;
        }

        if (jsonObject.articleIds) {
            this.articleIds = jsonObject.articleIds;
        }

        if (jsonObject.userId) {
            this.userId = jsonObject.userId;
        }
    }

    containArticle(article: Article): boolean {
        let isContain = false;

        if (this.articles) {
            for (const articleObj of this.articles) {
                if (articleObj.id == article.id) {
                    isContain = true;
                    break;
                }
            }
        } else {
            if (this.articleIds) {
                for (const articleId of this.articleIds) {
                    if (articleId == article.id) {
                        isContain = true;
                        break;
                    }
                }
            }
        }

        return isContain;
    }
}
