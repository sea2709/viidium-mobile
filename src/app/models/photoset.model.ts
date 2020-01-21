import {Photo} from './photo.model';
import {Article} from './article.model';

export class PhotoSet {
    public id: number;
    public name: string;
    public photos: Photo[];
    public sourceArticle: Article;

    constructor(jsonObject) {
        this.id = jsonObject.id;
        this.name = jsonObject.name;
        this.photos = jsonObject.photos;

        if (jsonObject.sourceArticle) {
            this.sourceArticle = jsonObject.sourceArticle;
        }
    }
}
