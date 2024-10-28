import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], filter: { descricao?: string; categoria?: string }): any[] {
    if (!items || (!filter.descricao && !filter.categoria)) {
      return items; // Retorna todos os itens se não houver filtro
    }

    return items.filter(item => {
      const descricaoMatch = filter.descricao ? item.descricao.toLowerCase().includes(filter.descricao.toLowerCase()) : true;
      const categoriaMatch = filter.categoria ? item.categoria === filter.categoria : true;
      return descricaoMatch && categoriaMatch; // Retorna verdadeiro se ambos os critérios corresponderem
    });
  }
}
