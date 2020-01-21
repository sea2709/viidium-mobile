export class Photo {
    public title: string;
    public src: string;
    public alt: string;

    constructor(jsonObject) {
        this.title = jsonObject.title;
        this.src = jsonObject.src;
        this.alt = jsonObject.alt;
    }
}
