import {Article} from './article.model';

export class Group {
    public id: number;
    public articles: Article[];
    public isRelatedGroup: boolean;

    constructor(jsonObject) {
        this.id = jsonObject.id;
        this.isRelatedGroup = jsonObject.isRelatedGroup && jsonObject.isRelatedGroup === '1';

        if (jsonObject.articles) {
            this.articles = jsonObject.articles;
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
        } 

        return isContain;
    }
}
