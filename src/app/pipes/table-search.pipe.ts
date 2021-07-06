import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableSearch'
})
export class TableSearchPipe implements PipeTransform {

  transform(items: any[], value: string, label:string): any[] {
    if (!items) return [];
    if (!value) return  items;
    if (value == '' || value == null) return [];
    console.log(value);
    console.log(items);
    console.log(label);
    return items.filter(e => e[label].toLowerCase().indexOf(value) > -1 );
    
  }

}

