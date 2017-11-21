import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortBy'
})
export class SortByPipe implements PipeTransform {

  transform(array: any[], fieldName: string, reverse: boolean = false): any[] {
    if (!array || array.length < 1) return [];
    let direction = reverse ? -1 : 1;
    return array.sort((element1: any, element2: any) => {
      let value1 = element1[fieldName];
      let value2 = element2[fieldName];
      return value1 === value2 ? 0:
        value1 < value2 ? -direction : direction;
    });
  }

}
