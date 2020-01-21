import {SafeHtml} from '@angular/platform-browser';

export class Video {
    public id: number;
    public name: string;
    public image: string;
    public videoHtml: SafeHtml;
    public videoUrl: string;

    constructor(jsonObject) {
        this.id = jsonObject.id;
        this.name = jsonObject.name;
        this.image = jsonObject.image;
        this.videoHtml = jsonObject.videoHtml;
        this.videoUrl = jsonObject.videoUrl;
    }
}
