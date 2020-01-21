import {Injectable} from '@angular/core';

@Injectable()
export class ArrUtilities {
  shuffle(arr: any[]) {
    let m = arr.length, t, i;
  
    // While there remain elements to shuffle
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
  
      // And swap it with the current element.
      t = arr[m];
      arr[m] = arr[i];
      arr[i] = t;
    }
  
    return arr;
  }
}
