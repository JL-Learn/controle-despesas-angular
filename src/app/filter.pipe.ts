import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], filter: any): any[] {
    if (!items || (!filter.descricao && !filter.categoria)) {
      return items;
    }
    return items.filter(item => {
      return (!filter.descricao || item.descricao.includes(filter.descricao)) &&
        (!filter.categoria || item.categoria === filter.categoria);
    });
  }
}
