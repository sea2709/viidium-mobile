import {Article} from '../../models/article.model';

export class GetArticlesResponse {
    public articles: Article[];
    public total: number;
}