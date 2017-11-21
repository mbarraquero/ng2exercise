import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBy'
})
export class FilterByPipe implements PipeTransform {

  transform(values: any[], param: string, criteria: string): any {
    return criteria ? values.filter(value => value[param].toLowerCase().indexOf(criteria.toLowerCase()) !== -1) : values;
  }

}
