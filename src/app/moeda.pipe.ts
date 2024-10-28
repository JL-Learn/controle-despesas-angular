import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moeda',
  standalone: true
})
export class MoedaPipe implements PipeTransform {

  transform(value: number | null): string {
    if (value === null) {
      return 'R$ 0,00'; // Valor padrão caso seja nulo
    }
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }
}
