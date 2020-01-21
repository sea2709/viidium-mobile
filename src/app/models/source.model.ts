export class Source {
    public id: number;
    public name: string;
    public redirect: boolean;

    constructor(jsonObject) {
        this.id = jsonObject.id;
        this.name = jsonObject.name;
        this.redirect = jsonObject.redirect;
    }
}