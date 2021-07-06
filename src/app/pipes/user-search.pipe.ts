import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userSearch'
})
export class UserSearchPipe implements PipeTransform {

  transform(items: any[], args: string, args1: any[]): any {
    if (items&&args) {
      return items.filter(item => {
        for (var i = 0; i < args1.length; i++) {
          if(item[args1[i]] == undefined)
          {
            return false;
          }
          if (item[args1[i]].toLowerCase().indexOf(args.toLowerCase()) !== -1) {
            return true;
          }
        }
        return false;
      });
    } else {
      return items;
    }
  }

}
