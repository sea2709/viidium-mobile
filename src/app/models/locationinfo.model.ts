export class LocationInfo {
  id: number;
  lat: number;
  lng: number;
  city: string;
  state: string;
  country: string;
  name: string;

  constructor(jsonObject) {
    if (jsonObject !== null) {
      this.id = jsonObject.id;
      this.lat = Number(jsonObject.lat);
      this.lng = Number(jsonObject.lng);
      this.city = jsonObject.city;
      this.state = jsonObject.state;
      this.country = jsonObject.country;
      this.name = jsonObject.name;
    }
  }
}