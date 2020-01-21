import {Article} from './article.model';

export class Category {
    public name: string;
    public id: number;
    public description: string;
    public color = '#AAA';
    public alphaColor = '#AAA';
    public articles: Article[] = [];
    public isPromotedToMobileHomePage = false;
    public latestArticleImage: string;
    public groupLayout: number;
    public thumbnail: string;
    public whiteThumbnail: string;
    public latestArticleCreated: number;

    constructor(jsonObject) {
        this.id = jsonObject.tid;
        this.name = jsonObject.name;
        this.description = jsonObject.description;

        if (jsonObject.color) {
            this.color = jsonObject.color;
            this.alphaColor = this._convertHexToRGBA(this.color, 0.35);
        }

        this.isPromotedToMobileHomePage = jsonObject.isPromotedToMobileHomePage == '1';

        this.latestArticleImage = jsonObject.latestArticleImage;

        this.groupLayout = jsonObject.groupLayout;

        this.thumbnail = jsonObject.thumbnail;

        this.whiteThumbnail = jsonObject.whiteThumbnail;

        this.latestArticleCreated = jsonObject.latestArticleCreated;
    }

    private _convertHexToRGBA(hex: string, opacity?: number): string {
        opacity = opacity || 1;

        opacity < 0 ? opacity = 0 : opacity = opacity;
        opacity > 1 ? opacity = 1 : opacity = opacity;

        hex = hex.replace('#', '');

        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
    }
}