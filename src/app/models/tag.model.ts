export class Tag {
  public id: number;
  public name: string;

  constructor(jsonObject) {
    this.id = jsonObject.id;
    this.name = jsonObject.name;
  }
}