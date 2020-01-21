import {Pipe, PipeTransform} from '@angular/core';
import * as unidecode from 'unidecode';

@Pipe({name: 'slugify'})
export class SlugifyPipe implements PipeTransform {
  transform(value: string): string {
    return value ? unidecode(value).toLowerCase().replace(/[^\w\s]/gi, '').replace(/ +(?= )/g, '').replace(/ /gi, '-') : '';
  }
}