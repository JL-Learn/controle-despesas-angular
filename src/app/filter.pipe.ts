import { Pipe, PipeTransform } from '@angular/core';

/* Funcionamento do Pipe:

  Esse pipe, chamado FilterPipe, é utilizado para filtrar uma lista de itens com base em critérios específicos, que são fornecidos através de um objeto de filtro. Aqui está um resumo de suas funcionalidades:

  Entrada:
  O pipe recebe dois parâmetros:
  items: um array de objetos que contêm informações (como descricao e categoria).
  filter: um objeto que pode ter propriedades descricao e categoria, que são os critérios usados para filtrar os itens.
  Verificação Inicial:

  O pipe verifica se a lista de items está vazia ou se não há filtros especificados (ou seja, se tanto filter.descricao quanto filter.categoria são indefinidos ou vazios).
  Se não houver itens ou filtros, ele simplesmente retorna a lista original de items.

  Filtragem:
  Para cada item na lista, o pipe aplica as seguintes verificações:
  Filtro de Descrição: Se um valor para filter.descricao foi fornecido, ele verifica se a descrição do item contém esse valor. A comparação é feita de forma case-insensitive (ignorando maiúsculas e minúsculas) usando toLowerCase().
  Filtro de Categoria: Se um valor para filter.categoria foi fornecido, ele verifica se a categoria do item é igual ao valor do filtro.

  Retorno:
  O pipe retorna um novo array contendo apenas os itens que atendem a ambos os critérios de filtragem (ou apenas o que tiver filtros aplicados, se houver).

  Exemplo de Uso:
  Imagine que você tenha uma lista de despesas, onde cada despesa tem uma descrição e uma categoria. Se você quiser exibir apenas as despesas que contêm "almoço" na descrição e pertencem à categoria "alimentação", você usaria esse pipe em um template Angular assim:

  <div *ngFor="let despesa of despesas | filter: { descricao: 'almoço', categoria: 'alimentação' }">
    {{ despesa.descricao }} - {{ despesa.categoria }}
  </div>

  Neste exemplo, apenas as despesas que atendem a ambos os critérios seriam exibidas.

  Resumo:
  O FilterPipe é uma ferramenta útil para tornar a exibição de dados mais dinâmica e interativa, permitindo que os usuários encontrem rapidamente informações relevantes em listas.
*/

interface Item {
  descricao: string;
  categoria: string;
  valor: number;
}

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  /*
    No seu FilterPipe, o parâmetro items é um array de objetos que representam as despesas ou itens que o usuário criou ou definiu. Vamos detalhar isso um pouco mais.

    Estrutura do Array items

    Array de Objetos: O items é um array que contém múltiplos objetos. Cada objeto representa uma despesa ou item e possui propriedades que você definiu (por exemplo, descricao e categoria).

    Criação pelo Usuário: Esses objetos são tipicamente criados pelo usuário ao preencher um formulário ou interface no seu aplicativo. Quando o usuário insere informações, cada entrada pode ser convertida em um objeto que é adicionado a este array.

    Exemplo de Estrutura
    Suponha que o usuário tenha adicionado as seguintes despesas:

    const items = [
      { descricao: "Almoço", categoria: "Alimentação" },
      { descricao: "Cinema", categoria: "Lazer" },
      { descricao: "Compras de supermercado", categoria: "Alimentação" }
    ];
    Neste exemplo, items é um array que contém três objetos, cada um com uma descrição e uma categoria.

    Uso no Pipe
    Filtragem: O pipe utiliza este array para aplicar a lógica de filtragem com base nas condições que o usuário especificou nos campos de filtro. Por exemplo, se o usuário deseja ver apenas itens da categoria "Alimentação", o pipe irá iterar sobre o array items e retornar apenas aqueles que atendem ao critério.

    Resumo
    items é um array que contém objetos representando as despesas ou itens que o usuário definiu.
    Cada objeto tem propriedades como descricao e categoria.
    O pipe utiliza esse array para aplicar filtros baseados nas entradas do usuário.

    Vamos analisar a condição !items e o que significa "falsy" em JavaScript.

    O que é "falsy"?
    Em JavaScript, "falsy" se refere a valores que são considerados falsos quando avaliados em um contexto booleano. Os seguintes valores são considerados falsy/false:

    false
    0 (zero)
    "" (string vazia)
    null
    undefined
    NaN (Not-a-Number)

    O que faz !items?
    O operador ! é o operador de negação lógica. Ele inverte o valor booleano do que está à sua direita.
    Portanto, !items será true se items for qualquer um dos valores mencionados acima.

    O que !items verifica?

    Se items for null:
    !null retorna true, indicando que items não existe.

    Se items for undefined:
    !undefined retorna true, indicando que items não foi definido.

    Se items for um array vazio []:
    Um array vazio é tecnicamente um objeto em JavaScript, e por isso [] é considerado truthy. Portanto, ![] retorna false.

    Isso significa que um array vazio não fará com que a condição !items seja verdadeira. A filtragem ainda será realizada e resultará em um array vazio.

    Resumo da Condição

    !items verifica:
    Se items é null ou undefined: A condição será verdadeira, e o código retornará items, que será null ou undefined.
    Se items é um array vazio ([]): A condição será falsa, e o código não entrará nesse bloco. A execução continuará para a lógica de filtragem, onde o array vazio será processado.

    Conclusão
    Portanto, a verificação !items é útil para lidar com casos em que não há itens disponíveis (ou seja, null ou undefined), enquanto permite que um array vazio seja processado pela lógica de filtragem.

    Quando items é retornado como null ou undefined em seu pipe, isso significa que não há dados disponíveis para serem exibidos. Vamos entender como isso se reflete na interface da sua aplicação.

    Quando items é null ou undefined

    Retorno null ou undefined:
    Quando o pipe encontra que items é null ou undefined, ele retorna esse valor diretamente.
    Isso geralmente indica que não há despesas ou itens a serem mostrados, seja porque o usuário não adicionou nada ou porque a lista foi limpa.

    Impacto na Interface:
    Na sua aplicação Angular, se o pipe retorna null ou undefined, a parte da interface que depende desse valor (por exemplo, uma lista ou tabela) pode não exibir nada.
    Dependendo de como você implementou a renderização, a interface pode simplesmente ficar em branco, ou pode haver um espaço onde normalmente seriam mostrados os itens.

    Comportamento do Template
    No seu template Angular, você pode ter algo como:

    <ul>
      <li *ngFor="let item of items | filter: filterOptions">{{ item.descricao }}</li>
    </ul>

    Se items for null ou undefined: O *ngFor não irá iterar sobre nada, e nada será renderizado na tela.
    Se items for um array vazio ([]): Da mesma forma, não haverá itens a serem exibidos, resultando em uma lista vazia.

    Exibição de Mensagens

    É comum em aplicações web implementar uma mensagem amigável para o usuário quando não há itens a serem exibidos. Por exemplo:

      <li *ngFor="let item of items | filter: filterOptions">{{ item.descricao }}</li>
      <li *ngIf="!(items?.length)">Nenhum item encontrado.</li>
    </ul>

    Nesse exemplo, se items for null, undefined ou um array vazio, a mensagem "Nenhum item encontrado." será exibida.

    Resumo

    null ou undefined: Significa que não há dados a serem exibidos, resultando em nada sendo mostrado na interface.
    Array Vazio: Também resulta em nada exibido, a menos que você implemente uma mensagem ou um comportamento específico para informar ao usuário.

    null e undefined

    null e undefined são diferentes em JavaScript, embora ambos representem a ausência de valor. Vamos detalhar as diferenças entre eles:

    1. null
    Definição: null é um valor que representa a "ausência intencional de qualquer objeto ou valor". É um valor atribuído explicitamente.
    Uso: Geralmente usado para indicar que uma variável foi intencionalmente definida como "sem valor".
    Tipo: O tipo de null é um objeto (isso é uma peculiaridade histórica em JavaScript).

    Exemplo

    let a = null; // a é intencionalmente vazio
    console.log(a); // null
    console.log(typeof a); // "object"

    2. undefined
    Definição: undefined significa que uma variável foi declarada, mas não foi atribuída a nenhum valor. Também é o valor padrão de variáveis não inicializadas.
    Uso: Geralmente indica que uma variável não tem valor ou que uma propriedade de um objeto não foi definida.
    Tipo: O tipo de undefined é "undefined".

    Exemplo

    let b; // b é declarada, mas não inicializada
    console.log(b); // undefined
    console.log(typeof b); // "undefined"

    let obj = {};
    console.log(obj.prop); // undefined, pois prop não existe no objeto

    Comparação
    Atribuição: Você pode atribuir null a uma variável para indicar que ela não tem um valor. undefined geralmente é um estado padrão que ocorre quando uma variável não é inicializada.

    Tipo: typeof null retorna "object" e typeof undefined retorna "undefined".

    Comparação: Em uma comparação não estrita (==), null e undefined são considerados iguais:

    console.log(null == undefined); // true

    Mas em uma comparação estrita (===), eles são diferentes:

    console.log(null === undefined); // false

    Resumo

    null é um valor atribuído intencionalmente que indica a ausência de valor.
    undefined é o estado de uma variável que foi declarada mas não inicializada, ou uma propriedade que não existe.
    Eles são diferentes em tipo e em como são usados, embora possam ser considerados "ausência de valor" em contextos diferentes.
  */
  transform(items: Item[], filter: { descricao?: string; categoria?: string }): Item[] {
    if (!items || (!filter.descricao && !filter.categoria)) {
      return items; // O que é retornado é exatamente null ou undefined, que indica que não há itens a serem processados
    }

    return items.filter(item => {
      const descricaoMatch = filter.descricao ?
        item.descricao?.toLowerCase().includes(filter.descricao.toLowerCase()) : true;
      const categoriaMatch = filter.categoria ?
        item.categoria === filter.categoria : true;
      /* return descricaoMatch && categoriaMatch;

        O Que Isso Significa?
        Finalidade: categoriaMatch é uma parte fundamental da lógica de filtragem do pipe. Ela determina se um item deve ser incluído na lista filtrada com base na correspondência de categorias.

        Combinação com descricaoMatch: A linha return descricaoMatch && categoriaMatch; retorna true apenas se ambos os critérios de filtragem (descrição e categoria) forem atendidos. Se qualquer um deles não for atendido, o resultado será false, e o item será excluído da lista final.

        Exemplo Prático
        Suponha que você tenha o seguinte filtro e itens:

        Filtros:
        const filter = { descricao: "almoço", categoria: "Alimentação" };

        Itens:
        const item1 = { descricao: "Almoço em família", categoria: "Alimentação" }; // match
        const item2 = { descricao: "Corte de cabelo", categoria: "Serviços" }; // não match
        const item3 = { descricao: "Jantar", categoria: "Alimentação" }; // match

        Para item1:
        descricaoMatch será true (pois "Almoço em família" contém "almoço").
        categoriaMatch será true (pois "Alimentação" é igual a "Alimentação").
        Resultado: return true && true, o que retorna true, e item1 é incluído.

        Para item2:
        descricaoMatch será true (não filtramos por descrição).
        categoriaMatch será false (porque "Serviços" não é igual a "Alimentação").
        Resultado: return true && false, o que retorna false, e item2 é excluído.

        Para item3:
        descricaoMatch será true (não filtramos por descrição).
        categoriaMatch será true (pois "Alimentação" é igual a "Alimentação").
        Resultado: return true && true, o que retorna true, e item3 é incluído.

        Resumo
        A constante categoriaMatch é essencial para verificar se a categoria de um item corresponde ao filtro de categoria. Ela é usada na lógica de filtragem do pipe para decidir se o item deve ser incluído ou não na lista final que é retornada.
      */
      return descricaoMatch && categoriaMatch;
    });
  }
}
