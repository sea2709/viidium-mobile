import {Article} from './article.model';

export class LatestArticlesCollection {
    public articles: Article[];

    public getGroup1Articles(): Article[] {
        return this.articles.slice(0, 5);
    }

    public getGroup2Articles(): Article[] {
        return this.articles.slice(5, 10);
    }

    public getGroup3Articles(): Article[] {
        return this.articles.slice(10, 15);
    }

    public getGroup4Articles(): Article[] {
        return this.articles.slice(15, 20);
    }

    public getGroup5Articles(): Article[] {
        return this.articles.slice(20, 25);
    }

    public getTotalArticles(): number {
        return this.articles.length;
    }
}
