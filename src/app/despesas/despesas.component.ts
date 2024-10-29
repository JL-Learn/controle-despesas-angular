import { Component, AfterViewInit } from '@angular/core';
import { jsPDF } from 'jspdf';
import { Despesa } from '../despesas.model';
import { FormsModule } from '@angular/forms';
import autoTable from 'jspdf-autotable';
import { FilterPipe } from '../filter.pipe';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { MoedaPipe } from '../moeda.pipe';

Chart.register(...registerables);

@Component({
  selector: 'app-despesas',
  standalone: true,
  imports: [
    FormsModule,
    FilterPipe,
    CommonModule,
    MoedaPipe,
  ],
  templateUrl: './despesas.component.html',
  styleUrls: ['./despesas.component.css']
})
export class DespesasComponent implements AfterViewInit {
  despesas: Despesa[] = [];
  descricao: string = '';
  valor: number | null = null;
  categoria: string = '';
  categorias = ['Alimentação', 'Chácara', 'Saúde', 'Lazer', 'Casa', 'Cartão de Crédito', 'Outros'];
  filtroDescricao: string = '';
  filtroCategoria: string = '';
  indexEdicao: number | null = null; // Variável para armazenar o índice da despesa em edição
  botaoTexto: string = 'Adicionar Despesa';
  private chart: Chart | null = null;
  mensagem: string = '';
  mensagemClass: string = '';

  constructor() {
    this.carregarDespesas();
  }

  ngAfterViewInit() {
    this.gerarGrafico();
  }

  /* Estrutura da Função adicionarDespesa()

    A função adicionarDespesa() é responsável por adicionar uma nova despesa à lista ou atualizar uma despesa existente. Aqui está uma análise passo a passo:

    Validação de Entrada:

    if (!this.descricao || !this.valor || this.valor <= 0 || !this.categoria) {
      this.mensagem = 'Por favor, preencha todos os campos com valores válidos.';
      this.mensagemClass = 'mensagem'; // Classe padrão para erro
      return; // Se a validação falhar, sai da função
    }

    A função começa validando os campos de entrada (descricao, valor, categoria).
    Se algum campo estiver vazio ou o valor for inválido (como um número negativo), uma mensagem de erro é atribuída à propriedade mensagem, e a função é encerrada.

    Criação de uma Nova Despesa:

    const novaDespesa = { descricao: this.descricao, valor: this.valor, categoria: this.categoria };
    Se a validação for bem-sucedida, um novo objeto novaDespesa é criado com os dados do formulário.

    Adicionar ou Atualizar:

    if (this.indexEdicao !== null) {
      // Atualiza a despesa existente
      this.despesas[this.indexEdicao] = novaDespesa;
      this.indexEdicao = null; // Reseta o índice de edição
      this.botaoTexto = 'Adicionar Despesa'; // Reseta o texto do botão
      this.mensagem = 'Despesa atualizada com sucesso!'; // Mensagem ao atualizar
    } else {
      // Adiciona uma nova despesa
      this.despesas.push(novaDespesa);
      this.mensagem = 'Despesa adicionada com sucesso!'; // Mensagem ao adicionar
    }

    Se a propriedade indexEdicao não for null, significa que uma despesa está sendo editada, e a função atualiza essa despesa na lista.
    Se não houver edição, a nova despesa é adicionada ao array despesas.
    Em ambos os casos, uma mensagem de sucesso é atribuída à propriedade mensagem.

    Resetar o Formulário:

    this.resetForm();
    Após adicionar ou atualizar a despesa, o formulário é resetado para limpar os campos de entrada.

    Salvar Despesas:

    this.salvarDespesas();
    As despesas são salvas no localStorage, garantindo que os dados permaneçam disponíveis mesmo após recarregar a página.

    Gerar Gráfico:

    this.gerarGrafico();
    A função gerarGrafico() é chamada para atualizar o gráfico com as novas despesas.

    Mensagens de Sucesso:

    this.mensagemClass = 'mensagem mensagem-success';
    setTimeout(() => {
        this.mensagem = '';
        this.mensagemClass = '';
    }, 3000); // 3000 milissegundos = 3 segundos

    A classe da mensagem é ajustada para indicar sucesso, e uma mensagem é exibida. Após 3 segundos, a mensagem é limpa.

    Relação com o Resto do Componente

    Interatividade: A função adicionarDespesa() é chamada quando o botão de adicionar ou atualizar despesa é clicado. Isso permite que os usuários insiram dados através do formulário.

    Estado da Aplicação: As mudanças que a função faz no array despesas impactam diretamente a tabela e o gráfico exibidos na interface. A tabela é atualizada automaticamente devido ao Angular's data binding.

    Persistência de Dados: Ao salvar as despesas no localStorage, a função garante que os dados sejam mantidos entre as sessões do navegador.

    Feedback do Usuário: As mensagens de sucesso ou erro melhoram a experiência do usuário, informando-o sobre o resultado da ação.

    Conclusão

    A função adicionarDespesa() é central para a lógica de interação do componente, pois gerencia a adição e edição de despesas, valida entradas e atualiza a interface do usuário de forma dinâmica. Sua implementação é uma parte crucial para garantir que a aplicação funcione corretamente e ofereça uma boa experiência ao usuário.

    A função adicionarDespesa() está diretamente relacionada ao template do componente por meio da interação do usuário. Vamos explorar essa relação e como ela se reflete no template.

    Análise do Template
    Aqui está a parte relevante do template (despesas.component.html) onde a função adicionarDespesa() é invocada:

    html

    <div class="form-despesa">
      <input [(ngModel)]="descricao" placeholder="Descrição" />
      <input [(ngModel)]="valor" type="number" placeholder="Valor" />
      <select [(ngModel)]="categoria">
        <option value="" disabled selected>Selecione a Categoria</option>
        <option *ngFor="let cat of categorias" [value]="cat">{{ cat }}</option>
      </select>
      <button (click)="adicionarDespesa()">{{ botaoTexto }}</button>
    </div>

    Relação Detalhada com a Função adicionarDespesa()

    Inputs de Dados:
    Os três campos de entrada (input e select) estão ligados a propriedades do componente usando o ngModel. Cada um deles é essencial para a função adicionarDespesa():

    descricao: O campo para o usuário inserir a descrição da despesa.

    valor: O campo para o usuário inserir o valor da despesa, que deve ser um número.

    categoria: Um select que permite ao usuário escolher uma categoria dentre as opções disponíveis.

    Esses campos fornecem os dados que a função adicionarDespesa() usa para criar ou atualizar um objeto de despesa.
    Botão de Ação:

    O botão <button (click)="adicionarDespesa()">{{ botaoTexto }}</button> é fundamental para a interação:
    O evento (click) no botão chama a função adicionarDespesa() quando o usuário clica no botão.
    O texto do botão é determinado pela propriedade botaoTexto, que alterna entre "Adicionar Despesa" e "Atualizar Despesa", dependendo se uma despesa está em modo de edição ou não.
    Essa ação dispara a lógica que valida os dados inseridos, adiciona ou atualiza a despesa na lista e exibe mensagens de feedback.

    Feedback ao Usuário:

    O template inclui um bloco que exibe mensagens de feedback ao usuário:
    html

    <div *ngIf="mensagem" [ngClass]="mensagemClass">{{ mensagem }}</div>

    Após a execução da função adicionarDespesa(), a propriedade mensagem é atualizada com um texto que informa o usuário sobre a ação realizada (adicionada ou atualizada com sucesso). O ngIf garante que esta mensagem só apareça quando houver um valor em mensagem.

    A classe mensagemClass é ajustada para diferenciar mensagens de erro e sucesso.

    Conclusão

    A função adicionarDespesa() e o template estão intimamente interligados. O template serve como a interface onde o usuário insere os dados necessários, e a função manipula esses dados para adicionar ou atualizar despesas na aplicação. A interação entre o template e a função permite que o usuário tenha uma experiência dinâmica e responsiva.
  */
  adicionarDespesa() {
    // Validação de entrada
    if (!this.descricao || !this.valor || this.valor <= 0 || !this.categoria) {
      this.mensagem = 'Por favor, preencha todos os campos com valores válidos.';
      this.mensagemClass = 'mensagem'; // Classe padrão para erro
      return; // Se a validação falhar, sai da função
    }

    const novaDespesa = { descricao: this.descricao, valor: this.valor, categoria: this.categoria };

    if (this.indexEdicao !== null) {
      // Atualiza a despesa existente
      this.despesas[this.indexEdicao] = novaDespesa;
      this.indexEdicao = null; // Reseta o índice de edição
      this.botaoTexto = 'Adicionar Despesa'; // Reseta o texto do botão
      this.mensagem = 'Despesa atualizada com sucesso!'; // Mensagem ao atualizar
    } else {
      // Adiciona uma nova despesa
      this.despesas.push(novaDespesa);
      this.mensagem = 'Despesa adicionada com sucesso!'; // Mensagem ao adicionar
    }

    this.resetForm();
    this.salvarDespesas();
    this.gerarGrafico();

    // Define a classe da mensagem
    this.mensagemClass = 'mensagem mensagem-success';

    // Limpa a mensagem após 3 segundos
    setTimeout(() => {
      this.mensagem = '';
      this.mensagemClass = '';
    }, 3000); // 3000 milissegundos = 3 segundos
  }

  /* Estrutura da Função editarDespesa()

    Aqui está a definição da função:

    editarDespesa(index: number) {
        const despesa = this.despesas[index];
        this.descricao = despesa.descricao;
        this.valor = despesa.valor;
        this.categoria = despesa.categoria;
        this.indexEdicao = index; // Armazena o índice da despesa em edição
        this.botaoTexto = 'Atualizar Despesa'; // Altera o texto do botão
        this.mensagem = '';
    }

    Análise Passo a Passo

    Parâmetro index:

    A função recebe um parâmetro index, que representa a posição da despesa na lista despesas que o usuário deseja editar.

    Recuperando a Despesa:

    const despesa = this.despesas[index];

    A despesa correspondente ao índice fornecido é recuperada do array despesas.
    Preenchendo os Campos do Formulário:

    this.descricao = despesa.descricao;
    this.valor = despesa.valor;
    this.categoria = despesa.categoria;

    Os campos do formulário (descrição, valor e categoria) são preenchidos com os dados da despesa que está sendo editada. Isso permite que o usuário veja as informações existentes e as modifique.

    Armazenando o Índice da Edição:

    this.indexEdicao = index; // Armazena o índice da despesa em edição

    O índice da despesa em edição é armazenado na propriedade indexEdicao. Isso é importante para que a função adicionarDespesa() saiba que uma despesa está sendo atualizada, não adicionada como uma nova.

    Alterando o Texto do Botão:

    this.botaoTexto = 'Atualizar Despesa'; // Altera o texto do botão

    O texto do botão é mudado para "Atualizar Despesa", indicando ao usuário que, ao clicar, a despesa existente será atualizada em vez de uma nova ser adicionada.

    Limpando Mensagens Anteriores:

    this.mensagem = '';
    A mensagem é limpa para evitar confusão, já que o usuário está prestes a editar uma despesa.

    Relação com o Template

    A função editarDespesa() está diretamente conectada ao template do componente, especialmente nas seguintes partes:

    1. Botão de Edição
    O botão de edição na tabela de despesas chama a função editarDespesa():

    html

    <button class="btn-editar" (click)="editarDespesa(i)">Editar</button>

    Quando o usuário clica nesse botão, o índice i (a posição da despesa na lista) é passado como argumento para a função editarDespesa().
    Isso permite que a função saiba qual despesa deve ser editada.

    2. Campos de Entrada
    Os campos de entrada do formulário são preenchidos com os dados da despesa selecionada:

    html

    <input [(ngModel)]="descricao" placeholder="Descrição" />
    <input [(ngModel)]="valor" type="number" placeholder="Valor" />
    <select [(ngModel)]="categoria">
      <option value="" disabled selected>Selecione a Categoria</option>
      <option *ngFor="let cat of categorias" [value]="cat">{{ cat }}</option>
    </select>

    O uso de ngModel permite que os dados da despesa selecionada sejam exibidos nesses campos de entrada, permitindo que o usuário faça as alterações necessárias.

    3. Texto do Botão
    O texto do botão de adicionar/atualizar despesa é controlado pela propriedade botaoTexto:

    html

    <button (click)="adicionarDespesa()">{{ botaoTexto }}</button>

    Quando uma despesa é editada, o texto do botão muda para "Atualizar Despesa", indicando a ação que será realizada ao clicar.

    Resumo

    A função editarDespesa() é crucial para permitir que o usuário modifique uma despesa existente. Ela popula os campos de entrada com os dados da despesa selecionada, altera o texto do botão para indicar a ação de atualização e armazena o índice da despesa em edição. Essa interação se reflete diretamente no template, onde os campos e o botão se ajustam de acordo com o estado atual da operação.

    A propriedade this.indexEdicao desempenha um papel crucial na função adicionarDespesa(), especialmente no contexto de edição e adição de despesas. Vamos analisar como isso funciona.

    Contexto
    Definição de indexEdicao:

    indexEdicao é uma propriedade da classe DespesasComponent que armazena o índice da despesa que está sendo editada. Inicialmente, ela é null, indicando que nenhuma despesa está em modo de edição.

    Função editarDespesa():

    Quando o usuário clica no botão "Editar", a função editarDespesa(index: number) é chamada, onde index é o índice da despesa na lista.
    Dentro dessa função, this.indexEdicao = index; armazena o índice da despesa que o usuário deseja editar. Isso é fundamental para que a função adicionarDespesa() saiba que uma edição está ocorrendo em vez de uma nova adição.

    Função adicionarDespesa()
    Aqui está um trecho da função adicionarDespesa() relevante para a interação com indexEdicao:

    if (this.indexEdicao !== null) {
      // Atualiza a despesa existente
      this.despesas[this.indexEdicao] = novaDespesa;
      this.indexEdicao = null; // Reseta o índice de edição
      this.botaoTexto = 'Adicionar Despesa'; // Reseta o texto do botão
      this.mensagem = 'Despesa atualizada com sucesso!'; // Mensagem ao atualizar
    } else {
      // Adiciona uma nova despesa
      this.despesas.push(novaDespesa);
      this.mensagem = 'Despesa adicionada com sucesso!'; // Mensagem ao adicionar
    }

    Como Funciona a Integração

    Verificação do Índice:

    No início da função adicionarDespesa(), a condição if (this.indexEdicao !== null) verifica se existe um índice armazenado em indexEdicao. Isso indica que o usuário está editando uma despesa existente.

    Atualização da Despesa:
    Se indexEdicao não for null, a função atualiza a despesa correspondente no array despesas:

    this.despesas[this.indexEdicao] = novaDespesa;

    Aqui, novaDespesa é o objeto que contém os novos valores preenchidos nos campos de entrada.

    Resetando o Estado:

    Após a atualização, this.indexEdicao é redefinido para null:

    this.indexEdicao = null; // Reseta o índice de edição
    Isso garante que a próxima chamada a adicionarDespesa() seja tratada como uma nova adição, não como uma edição.

    Alteração do Texto do Botão:

    O texto do botão também é alterado de volta para "Adicionar Despesa" após a atualização.

    Mensagem ao Usuário:

    Uma mensagem de feedback é exibida para informar que a despesa foi atualizada com sucesso.

    Resumo

    A propriedade this.indexEdicao é essencial para distinguir entre adicionar uma nova despesa e editar uma existente. Ela permite que a função adicionarDespesa() saiba se deve atualizar um item existente ou adicionar um novo. Esse mecanismo proporciona uma experiência de usuário intuitiva, onde os dados carregados nos campos de entrada refletem a despesa que está sendo editada, e o botão muda seu texto para indicar a ação correta a ser realizada.
  */
  editarDespesa(index: number) {
    const despesa = this.despesas[index];
    this.descricao = despesa.descricao;
    this.valor = despesa.valor;
    this.categoria = despesa.categoria;
    this.indexEdicao = index; // Armazena o índice da despesa em edição
    this.botaoTexto = 'Atualizar Despesa'; // Altera o texto do botão
    this.mensagem = '';
  }

  /* Estrutura da Função excluirDespesa()

    Aqui está a definição da função:

    excluirDespesa(index: number) {
      this.despesas.splice(index, 1);
      this.salvarDespesas();
      this.gerarGrafico();
      this.mensagem = 'Despesa excluída com sucesso!';
      this.mensagemClass = 'mensagem'; // Classe padrão para erro

      // Limpa a mensagem após 3 segundos
      setTimeout(() => {
        this.mensagem = '';
        this.mensagemClass = '';
      }, 3000); // 3000 milissegundos = 3 segundos
    }

    Análise Passo a Passo

    Parâmetro index:

    A função recebe um parâmetro index, que representa a posição da despesa na lista despesas que o usuário deseja excluir.

    Removendo a Despesa:

    this.despesas.splice(index, 1);

    A função splice é usada para remover a despesa do array despesas com base no índice fornecido. O segundo argumento 1 indica que apenas um item deve ser removido.

    Salvando as Despesas:

    this.salvarDespesas();

    Após a remoção, a função salvarDespesas() é chamada para atualizar o armazenamento local (localStorage) com a lista de despesas atualizada. Isso garante que as mudanças persistam mesmo após um recarregamento da página.

    Gerando o Gráfico:

    this.gerarGrafico();

    A função gerarGrafico() é chamada para atualizar o gráfico que representa as despesas, garantindo que ele reflita a nova lista de despesas após a exclusão.

    Definindo Mensagem de Sucesso:

    this.mensagem = 'Despesa excluída com sucesso!';
    this.mensagemClass = 'mensagem'; // Classe padrão para erro

    Uma mensagem de feedback é definida para informar ao usuário que a despesa foi excluída com sucesso. A classe mensagemClass é definida como 'mensagem', que pode ser usada para estilizar a mensagem.
    Limpeza da Mensagem:

    setTimeout(() => {
        this.mensagem = '';
        this.mensagemClass = '';
    }, 3000); // 3000 milissegundos = 3 segundos

    Um setTimeout é utilizado para limpar a mensagem após 3 segundos, restaurando o estado do componente. Isso evita que a mensagem permaneça visível por muito tempo e melhora a experiência do usuário.

    Relação com o Template

    A função excluirDespesa() está diretamente conectada ao template do componente, especialmente nas seguintes partes:

    1. Botão de Exclusão
    O botão de exclusão na tabela de despesas chama a função excluirDespesa():

    html

    <button class="btn-excluir" (click)="excluirDespesa(i)">Excluir</button>

    Quando o usuário clica nesse botão, o índice i (a posição da despesa na lista) é passado como argumento para a função excluirDespesa().
    Isso permite que a função saiba qual despesa deve ser removida.

    2. Exibição da Mensagem

    A mensagem de feedback, que informa que a despesa foi excluída com sucesso, é exibida no template:

    html

    <div *ngIf="mensagem" [ngClass]="mensagemClass">{{ mensagem }}</div>

    O ngIf verifica se existe uma mensagem para ser exibida.
    O ngClass aplica a classe armazenada em mensagemClass, que pode ser estilizada para informar o usuário sobre a exclusão da despesa.

    Resumo

    A função excluirDespesa() é essencial para permitir que o usuário remova uma despesa da lista. Ela atualiza a lista de despesas, salva as alterações no armazenamento local, atualiza o gráfico e fornece feedback visual ao usuário sobre a ação realizada. Essa interação se reflete diretamente no template, onde o botão de exclusão e a mensagem de feedback estão conectados à lógica da função, criando uma experiência de usuário fluida e intuitiva.
  */
  excluirDespesa(index: number) {
    this.despesas.splice(index, 1);
    this.salvarDespesas();
    this.gerarGrafico();
    this.mensagem = 'Despesa excluída com sucesso!';
    this.mensagemClass = 'mensagem'; // Classe padrão para erro

    // Limpa a mensagem após 3 segundos
    setTimeout(() => {
      this.mensagem = '';
      this.mensagemClass = '';
    }, 3000); // 3000 milissegundos = 3 segundos
  }

  salvarDespesas() {
    localStorage.setItem('despesas', JSON.stringify(this.despesas));
  }

  /* Estrutura da Função carregarDespesas()

    Aqui está a definição da função:

    carregarDespesas() {
      const despesasSalvas = localStorage.getItem('despesas');
      if (despesasSalvas) {
          this.despesas = JSON.parse(despesasSalvas);
      }
    }

    Análise Passo a Passo

    Recuperando Dados do Local Storage:

    const despesasSalvas = localStorage.getItem('despesas');

    A função utiliza o método getItem do localStorage para tentar recuperar uma string que representa as despesas salvas anteriormente. O parâmetro 'despesas' é a chave sob a qual os dados foram armazenados.

    Verificando se Existem Despesas Salvas:

    if (despesasSalvas) {

    A função verifica se a variável despesasSalvas contém algum dado. Se não houver nada (ou seja, se o valor for null), isso significa que não há despesas salvas a serem carregadas.

    Convertendo a String em um Array de Objetos:

    this.despesas = JSON.parse(despesasSalvas);

    Se houver dados, a função usa JSON.parse() para converter a string recuperada em um array de objetos Despesa. Isso é necessário porque os dados são armazenados no formato JSON no localStorage.
    O array resultante é então atribuído à propriedade despesas da classe, que é um array que armazena todas as despesas.

    Relação com o Template

    A função carregarDespesas() está diretamente conectada ao funcionamento geral do componente e, indiretamente, ao template de algumas maneiras:

    1. Inicialização de Dados
    A função carregarDespesas() é chamada no construtor do componente:

    constructor() {
      this.carregarDespesas();
    }

    Isso significa que assim que uma instância do componente DespesasComponent é criada, as despesas salvas anteriormente são carregadas automaticamente. Essa abordagem garante que, ao acessar o componente, o usuário veja imediatamente as despesas que foram salvas previamente, melhorando a usabilidade.
    2. Exibição de Despesas no Template

    No template, as despesas carregadas são exibidas em uma tabela:

    <tr *ngFor="let despesa of despesas | filter: { descricao: filtroDescricao, categoria: filtroCategoria }; let i = index">
      <td>{{ despesa.descricao }}</td>
      <td>{{ despesa.valor | moeda }}</td>
      <td>{{ despesa.categoria }}</td>
      <td>
        <button class="btn-excluir" (click)="excluirDespesa(i)">Excluir</button>
        <button class="btn-editar" (click)="editarDespesa(i)">Editar</button>
      </td>
    </tr>

    A diretiva *ngFor itera sobre o array despesas. Quando a função carregarDespesas() é chamada e as despesas são carregadas, esse array é preenchido, permitindo que a tabela no template exiba as despesas corretamente.
    Além disso, o uso de um pipe de filtro (filter) permite que os usuários filtram as despesas exibidas com base na descrição ou categoria.

    Resumo

    A função carregarDespesas() é fundamental para a funcionalidade do componente, pois permite que as despesas salvas anteriormente sejam recuperadas e exibidas assim que o componente é inicializado. Isso garante que o usuário veja informações relevantes ao acessar a aplicação. Essa função estabelece uma conexão clara entre a lógica de carregamento de dados e a apresentação visual das despesas no template, proporcionando uma experiência de usuário fluida e intuitiva.
  */
  carregarDespesas() {
    const despesasSalvas = localStorage.getItem('despesas');
    if (despesasSalvas) {
      this.despesas = JSON.parse(despesasSalvas);
    }
  }

  /* Estrutura da Função gerarGrafico()

    Aqui está a definição da função:

    gerarGrafico() {
      const ctx = document.getElementById('myChart') as HTMLCanvasElement;

      if (this.chart) {
          this.chart.destroy();
      }

      const valoresPorCategoria = this.calcularValoresPorCategoria();
      const data = {
          labels: this.categorias,
          datasets: [{
          label: 'Despesas',
          data: valoresPorCategoria,
          backgroundColor: this.gerarCores(this.categorias.length),
        }]
      };

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: data,
      });
    }

    Análise Passo a Passo

    Obtendo o Contexto do Canvas:

    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    A função começa buscando o elemento HTML do canvas onde o gráfico será renderizado. O getElementById('myChart') retorna o elemento, e o as HTMLCanvasElement é uma asserção de tipo que informa ao TypeScript que o elemento é um canvas.

    Destruindo o Gráfico Existente:

    if (this.chart) {
      this.chart.destroy();
    }

    Antes de criar um novo gráfico, a função verifica se já existe um gráfico previamente renderizado (this.chart). Se sim, ele é destruído para evitar sobreposições e conflitos. Isso garante que sempre haverá um único gráfico exibido.

    Calculando Valores por Categoria:

    const valoresPorCategoria = this.calcularValoresPorCategoria();

    A função calcularValoresPorCategoria() é chamada para calcular a soma das despesas para cada categoria. Essa função retorna um array com os totais das despesas agrupadas por categoria.

    Estruturando os Dados para o Gráfico:

    const data = {
      labels: this.categorias,
      datasets: [{
        label: 'Despesas',
        data: valoresPorCategoria,
        backgroundColor: this.gerarCores(this.categorias.length),
      }]
    };

    Um objeto data é criado, que contém:

    labels: os rótulos (nomes) das categorias.
    datasets: um array que contém um objeto com a configuração do gráfico, incluindo o rótulo do conjunto de dados, os dados a serem plotados (valores por categoria) e as cores de fundo para as barras (geradas pela função gerarCores()).

    Criando o Gráfico:

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: data,
    });

    A classe Chart (do Chart.js) é instanciada, criando um gráfico do tipo 'bar' (barra) usando o contexto do canvas e os dados estruturados.

    Relação com o Template

    A função gerarGrafico() está diretamente conectada ao template do componente, especialmente em relação ao elemento canvas onde o gráfico é exibido:

    1. Elemento Canvas no Template
    No template do componente, existe um elemento canvas definido assim:

    html

    <canvas id="myChart"></canvas>

    Esse elemento é onde o gráfico será renderizado. A função gerarGrafico() utiliza este ID (myChart) para obter o contexto do canvas e desenhar o gráfico.

    2. Atualização Automática do Gráfico
    A função gerarGrafico() é chamada em várias partes do componente:

    Após Adicionar ou Excluir Despesas:

    Dentro das funções adicionarDespesa() e excluirDespesa(), gerarGrafico() é chamada para atualizar o gráfico com as despesas mais recentes.

    Após Carregar Despesas:
    Na função carregarDespesas(), embora não esteja explícito no código, é comum que gráficos sejam atualizados após o carregamento dos dados, garantindo que a visualização reflita o estado atual das despesas.

    Resumo

    A função gerarGrafico() é essencial para a visualização das despesas em forma gráfica, permitindo que o usuário veja a distribuição das despesas por categoria. Ela se relaciona diretamente com o template através do elemento canvas, que serve como a área onde o gráfico é desenhado. A função garante que sempre que as despesas forem adicionadas, removidas ou carregadas, o gráfico será atualizado automaticamente, proporcionando uma experiência interativa e informativa ao usuário.
  */
  gerarGrafico() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy();
    }

    const valoresPorCategoria = this.calcularValoresPorCategoria();
    const data = {
      labels: this.categorias,
      datasets: [{
        label: 'Despesas',
        data: valoresPorCategoria,
        backgroundColor: this.gerarCores(this.categorias.length),
      }]
    };

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: data,
    });
  }

  /* Estrutura da Função calcularValoresPorCategoria()

    Aqui está a definição da função:


    calcularValoresPorCategoria() {
      return this.categorias.map(cat =>
        this.despesas
          .filter(d => d.categoria === cat)
          .reduce((total, despesa) => total + despesa.valor, 0) || 0
      );
    }

    Análise Passo a Passo
    Iterando Sobre as Categorias:

    return this.categorias.map(cat => {

    A função utiliza o método map() para iterar sobre o array categorias, que contém as diferentes categorias de despesas (como 'Alimentação', 'Saúde', etc.). Para cada categoria (cat), um cálculo será feito.

    Filtrando Despesas por Categoria:

    this.despesas.filter(d => d.categoria === cat)

    Para cada categoria, a função filter() é usada no array despesas para criar um novo array contendo apenas as despesas que pertencem à categoria atual (cat). Isso resulta em um array de despesas filtradas.

    Calculando o Total da Categoria:

    .reduce((total, despesa) => total + despesa.valor, 0) || 0

    Em seguida, o método reduce() é aplicado ao array filtrado. O reduce() acumula os valores das despesas para a categoria, somando os valores (despesa.valor) de cada despesa.

    O segundo argumento 0 é o valor inicial do total. Se não houver despesas para a categoria, o resultado será 0 devido ao operador ||.

    Retorno do Resultado:

    A função retorna um array que contém o total de despesas para cada categoria.

    Relação com Outras Funções

    A função calcularValoresPorCategoria() é utilizada na função gerarGrafico():

    const valoresPorCategoria = this.calcularValoresPorCategoria();

    Contexto: Dentro de gerarGrafico(), calcularValoresPorCategoria() é chamada para obter os totais de despesas por categoria, que são necessários para construir os dados do gráfico.

    Interdependência: A função gerarGrafico() depende de calcularValoresPorCategoria() para obter os dados que serão plotados no gráfico, formando uma ligação clara entre elas.

    Relação com o Template

    A função calcularValoresPorCategoria() impacta indiretamente a visualização no template:

    Geração do Gráfico:

    A função é essencial para a criação do gráfico que representa as despesas por categoria. O gráfico, que é desenhado no canvas com ID myChart, depende dos dados retornados por calcularValoresPorCategoria().
    Atualização do Gráfico:

    Sempre que as despesas são alteradas (adição, edição ou exclusão), a função gerarGrafico() é chamada, que, por sua vez, chama calcularValoresPorCategoria(). Isso garante que o gráfico esteja sempre atualizado com os dados mais recentes.

    Resumo

    A função calcularValoresPorCategoria() é responsável por calcular o total de despesas para cada categoria, retornando um array com esses totais. Ela é utilizada pela função gerarGrafico(), que depende dos dados gerados para atualizar o gráfico exibido no template. Assim, embora não esteja diretamente relacionada a elementos do template, seu papel na lógica de cálculo é fundamental para garantir que as informações visuais apresentadas ao usuário sejam precisas e atuais.
  */
  calcularValoresPorCategoria() {
    return this.categorias.map(cat =>
      this.despesas
      .filter(d => d.categoria === cat)
      .reduce((total, despesa) => total + despesa.valor, 0) || 0
    );
  }

  /* Código da Função

    calcularTotal() {
      return this.despesas.reduce((total, despesa) => total + despesa.valor, 0);
    }

    Objetivo da Função

    A função calcularTotal() tem como objetivo calcular a soma total de todas as despesas armazenadas na propriedade despesas, que é um array de objetos do tipo Despesa. Cada objeto Despesa possui uma propriedade valor, que representa o valor da despesa.

    Como a Função Funciona

    Uso do Método reduce():

    A função utiliza o método reduce() do array despesas. O reduce() é uma função que percorre todos os elementos de um array e acumula um único resultado, que neste caso é a soma dos valores das despesas.

    Parâmetros do reduce():

    Função de Callback: O reduce() aceita uma função de callback que é chamada para cada elemento do array. Essa função recebe dois parâmetros:

    total: Este é o acumulador que armazena o total acumulado até o momento.
    despesa: Este é o objeto da despesa atual que está sendo processado.

    Valor Inicial: O segundo argumento do reduce() é 0, que é o valor inicial do total. Isso significa que, ao começar a somar, partimos de zero.

    Lógica de Acumulação:

    Dentro da função de callback, a linha total + despesa.valor realiza a soma do valor atual da despesa ao total acumulado.
    A cada iteração, o total é atualizado com a soma dos valores.

    Passo a Passo do Processo

    Vamos ver como essa função opera com um exemplo prático. Suponha que a propriedade despesas contenha os seguintes dados:

    this.despesas = [
      { descricao: 'Almoço', valor: 30 },
      { descricao: 'Transporte', valor: 15 },
      { descricao: 'Cinema', valor: 20 }
    ];

    Iterações do reduce()

    Início:

    total inicia em 0.
    1ª iteração (despesa = { descricao: 'Almoço', valor: 30 }):

    total = 0 + 30 → total = 30.
    2ª iteração (despesa = { descricao: 'Transporte', valor: 15 }):

    total = 30 + 15 → total = 45.
    3ª iteração (despesa = { descricao: 'Cinema', valor: 20 }):

    total = 45 + 20 → total = 65.

    Resultado Final

    Após todas as iterações, a função retorna 65, que é a soma total das despesas.

    Conexão com o Template
    No template do componente, a função calcularTotal() é utilizada da seguinte forma:

    html

    <h3>Total de Despesas: {{ calcularTotal() | moeda }}</h3>

    Explicação da Conexão

    Chamada da Função: A função é chamada diretamente no template dentro de uma interpolação {{ ... }}. Isso significa que, sempre que o Angular renderiza esse trecho, ele executa a função calcularTotal().
    Pipe moeda: O resultado da função (o total das despesas) é passado pelo pipe moeda, que formata o número para que seja exibido como uma quantia em dinheiro (por exemplo, "R$ 65,00").
    Atualização Dinâmica: Se o array despesas for alterado (por exemplo, se novas despesas forem adicionadas ou removidas), a função calcularTotal() será chamada novamente, e o total exibido no template será atualizado automaticamente.

    Resumo

    A função calcularTotal() soma todos os valores das despesas armazenadas no array despesas usando reduce().
    O resultado é exibido no template, formatado como uma quantia em dinheiro, garantindo que a interface do usuário sempre mostre o total atualizado das despesas.
  */
  calcularTotal() {
    return this.despesas.reduce((total, despesa) => total + despesa.valor, 0);
  }

  /* Código da Função

    gerarPDF() {

    const pdf = new jsPDF();

    const pdf = new jsPDF();: Aqui, estamos criando uma nova instância do objeto jsPDF, que é uma biblioteca que permite gerar documentos PDF em JavaScript. Essa instância será usada para construir o PDF.

    const title = "Despesas";

    const title = "Despesas";: Definimos o título que será exibido na parte superior do PDF. Neste caso, o título é "Despesas".

    const pageWidth = pdf.internal.pageSize.getWidth();

    const pageWidth = pdf.internal.pageSize.getWidth();: Esta linha obtém a largura da página do PDF. O objeto pdf tem uma propriedade interna que armazena as dimensões da página, e estamos acessando a largura para centralizar o título mais tarde.

    const textWidth = pdf.getTextWidth(title);

    const textWidth = pdf.getTextWidth(title);: Aqui, calculamos a largura do texto do título "Despesas". Isso nos ajudará a posicioná-lo corretamente na página.

    const xPosition = (pageWidth - textWidth) / 2;

    const xPosition = (pageWidth - textWidth) / 2;: Calculamos a posição horizontal (x) onde o título será desenhado. Subtraímos a largura do texto da largura da página e dividimos por 2 para centralizá-lo.


    pdf.text(title, xPosition, 10); // Título centralizado

    pdf.text(title, xPosition, 10);: Usamos o método text da instância pdf para desenhar o título na página. xPosition determina a posição horizontal e 10 é a posição vertical (y) do texto. O título ficará centralizado na parte superior do PDF.

    const tableColumn = ["Descrição", "Valor", "Categoria"];

    const tableColumn = ["Descrição", "Valor", "Categoria"];: Definimos as colunas da tabela que aparecerá no PDF. Cada elemento do array representa o cabeçalho da tabela.

    const tableRows = this.despesas.map(d => [
      d.descricao,
      this.formatarValor(d.valor), // Formata o valor para o PDF
      d.categoria
    ]);

    const tableRows = this.despesas.map(d => [...]);: Aqui, estamos criando um array de linhas para a tabela. Usamos map() para percorrer cada despesa no array despesas. Para cada despesa (d), geramos um array contendo:
    d.descricao: A descrição da despesa.

    this.formatarValor(d.valor): O valor da despesa formatado usando a função formatarValor(), que garante que o valor esteja no formato correto (por exemplo, "R$ 10,00").

    d.categoria: A categoria da despesa.

    const total = this.calcularTotal();

    const total = this.calcularTotal();: Chamamos a função calcularTotal() para obter a soma total das despesas. Este valor será adicionado à tabela como uma linha final.

    tableRows.push(["Total", this.formatarValor(total), ""]); // Formata o total

    tableRows.push(["Total", this.formatarValor(total), ""]);: Adicionamos uma nova linha ao array tableRows, que contém:
    "Total": A descrição que indica que esta linha representa o total das despesas.
    this.formatarValor(total): O total formatado para o PDF.
    Uma string vazia para a categoria, já que não é relevante nesta linha.

    autoTable(pdf, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid',
      didParseCell: (data) => {
        if (data.row.index > 0 && data.row.index < tableRows.length - 1) {
          const rowIndex = data.row.index - 1; // Ajusta o índice para as despesas
          if (rowIndex % 2 === 0) {
            data.cell.styles.fillColor = [240, 240, 240]; // Cor para linhas pares
          }
        }
      },
    });

    autoTable(pdf, {...}): Usamos a função autoTable da biblioteca jspdf-autotable para criar uma tabela no PDF.

    head: [tableColumn]: Passamos as colunas definidas anteriormente como cabeçalho da tabela.

    body: tableRows: Passamos as linhas que preparamos com as despesas e o total.

    startY: 20: Define a posição vertical inicial onde a tabela começará (20 unidades abaixo do topo da página).

    theme: 'grid': Aplica um tema de grade à tabela, que cria linhas e colunas visíveis.

    didParseCell: (data) => {...}: Esta é uma função de callback que permite modificar o estilo de cada célula durante a criação da tabela. Aqui, aplicamos uma cor de fundo alternada para as linhas das despesas (linhas pares), o que melhora a legibilidade.

    pdf.save('despesas.pdf');

    pdf.save('despesas.pdf');: Por fim, chamamos o método save() da instância pdf para baixar o documento gerado. O nome do arquivo será "despesas.pdf".

    Resumo

    A função gerarPDF() realiza as seguintes operações:

    Cria um novo documento PDF.
    Adiciona um título centralizado na parte superior.
    Prepara uma tabela com as despesas, formatando os valores adequadamente.
    Adiciona uma linha com o total das despesas.
    Aplica estilos para melhorar a apresentação da tabela.
    Salva o PDF gerado, permitindo que o usuário faça o download.
  */
  gerarPDF() {
    const pdf = new jsPDF();

    const title = "Despesas";
    const pageWidth = pdf.internal.pageSize.getWidth();
    const textWidth = pdf.getTextWidth(title);
    const xPosition = (pageWidth - textWidth) / 2;

    pdf.text(title, xPosition, 10); // Título centralizado
    const tableColumn = ["Descrição", "Valor", "Categoria"];

    const tableRows = this.despesas.map(d => [
      d.descricao,
      this.formatarValor(d.valor), // Formata o valor para o PDF
      d.categoria
    ]);

    const total = this.calcularTotal();
    tableRows.push(["Total", this.formatarValor(total), ""]); // Formata o total

    autoTable(pdf, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid',
      didParseCell: (data) => {
        // Aplica a cor de fundo alternada apenas para as linhas de despesas
        if (data.row.index > 0 && data.row.index < tableRows.length - 1) {
          const rowIndex = data.row.index - 1; // Ajusta o índice para as despesas
          if (rowIndex % 2 === 0) {
            data.cell.styles.fillColor = [240, 240, 240]; // Cor para linhas pares
          }
        }
      },
    });

    pdf.save('despesas.pdf');
  }

  /* Código da Função

    private formatarValor(valor: number): string {
      if (valor === null || valor === undefined) {
        return 'R$ 0,00'; // Retorna valor padrão
      }

      // Formata o valor em duas casas decimais
      const valorFormatado = valor.toFixed(2).replace('.', ','); // Troca ponto por vírgula
      const partes = valorFormatado.split(','); // Divide em partes
      const inteiro = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Formata a parte inteira
      return `R$ ${inteiro},${partes[1]}`; // Retorna valor formatado
    }

    Detalhamento da Função

    Definição da Função:

    private formatarValor(valor: number): string: A função é privada e espera um argumento valor do tipo number. Ela retorna uma string formatada.

    Verificação de Valor Nulo:

    if (valor === null || valor === undefined) {
      return 'R$ 0,00'; // Retorna valor padrão
    }

    Aqui, a função verifica se o valor é null ou undefined. Se for, retorna a string 'R$ 0,00', que é uma representação padrão para valores não definidos.

    Formatação em Duas Casas Decimais:

    const valorFormatado = valor.toFixed(2).replace('.', ',');

    valor.toFixed(2): Esta parte formata o número para ter exatamente duas casas decimais. Por exemplo, 10 se torna 10.00.

    .replace('.', ','): Em seguida, o ponto (.) é substituído por uma vírgula (,), seguindo a convenção brasileira de formatação monetária.

    Divisão em Partes:

    const partes = valorFormatado.split(',');

    O valor formatado é dividido em duas partes: a parte inteira e a parte decimal, usando a vírgula como delimitador. Por exemplo, 10,00 se tornará um array ['10', '00'].

    Formatação da Parte Inteira:

    const inteiro = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    Esta linha formata a parte inteira do número, inserindo pontos (.) a cada três dígitos para representar os milhares. A expressão regular /\B(?=(\d{3})+(?!\d))/g é usada para encontrar as posições onde os pontos devem ser inseridos.

    Por exemplo, 1000 se torna 1.000.

    Retorno do Valor Formatado:

    return `R$ ${inteiro},${partes[1]}`; // Retorna valor formatado

    A função retorna a string formatada, que inclui o símbolo de moeda "R$" seguido da parte inteira e da parte decimal, como R$ 1.000,00.

    Relação com o Template do Componente

    No template do componente, a função formatarValor() é chamada em várias situações, principalmente quando exibimos os valores das despesas e o total:

    html

    <td>{{ despesa.valor | moeda }}</td>

    Aqui, estamos usando um pipe chamado moeda, que pode estar utilizando a função formatarValor() por trás dos panos para formatar o valor antes de exibi-lo.

    html

    <h3>Total de Despesas: {{ calcularTotal() | moeda }}</h3>

    Da mesma forma, a função calcularTotal() provavelmente retorna um valor que também é formatado pelo pipe moeda para ser exibido de forma adequada.

    Resumo da Relação

    A função formatarValor() é essencial para garantir que todos os valores monetários sejam apresentados de forma consistente e legível para o usuário, seguindo a formatação brasileira.
    Ela é utilizada diretamente ou indiretamente (via pipe) no template para exibir valores das despesas e o total de forma adequada, incluindo o símbolo de moeda e a formatação correta.
  */
  // Método para formatar valores
  private formatarValor(valor: number): string {
    if (valor === null || valor === undefined) {
      return 'R$ 0,00'; // Retorna valor padrão
    }

    // Formata o valor em duas casas decimais
    const valorFormatado = valor.toFixed(2).replace('.', ','); // Troca ponto por vírgula
    const partes = valorFormatado.split(','); // Divide em partes
    const inteiro = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Formata a parte inteira
    return `R$ ${inteiro},${partes[1]}`; // Retorna valor formatado
  }

  resetForm() {
    this.descricao = '';
    this.valor = null;
    this.categoria = '';
  }

  /* Código da Função

    private gerarCores(num: number): string[] {
      const cores = [];
      for (let i = 0; i < num; i++) {
        const cor = `hsl(${(i * 360) / num}, 100%, 50%)`;
        cores.push(cor);
      }
      return cores;
    }

    Detalhamento da Função

    Definição da Função:

    private gerarCores(num: number): string[]: A função é privada e espera um argumento num, que representa a quantidade de cores a serem geradas. Ela retorna um array de strings, onde cada string é uma representação de uma cor no formato HSL (Hue, Saturation, Lightness).

    Inicialização do Array de Cores:

    const cores = [];

    Um array vazio cores é criado para armazenar as cores que serão geradas.

    Loop para Gerar Cores:

    for (let i = 0; i < num; i++) {

    Um loop for é iniciado, que irá iterar num vezes (de 0 até num - 1).

    Cálculo da Cor HSL:

    const cor = `hsl(${(i * 360) / num}, 100%, 50%)`;

    Dentro do loop, uma nova cor é calculada usando a notação HSL.
    (i * 360) / num: Esta parte calcula o matiz (Hue) da cor. O valor de i é multiplicado por 360 (o total de graus em um círculo de cores) e dividido pelo número total de cores (num). Isso assegura que as cores sejam distribuídas uniformemente ao longo do espectro de cores. Por exemplo:
    Se num for 5, os valores de matiz gerados seriam aproximadamente 0, 72, 144, 216 e 288 graus.
    100%: Isso define a saturação (Saturation) da cor como 100%, ou seja, as cores serão totalmente saturadas.
    50%: Isso define a luminosidade (Lightness) da cor como 50%, resultando em cores com brilho médio (nem muito claras nem muito escuras).

    Adicionando a Cor ao Array:

    cores.push(cor);

    A cor gerada é adicionada ao array cores usando o método push().

    Retorno do Array de Cores:

    return cores;

    Após o loop, a função retorna o array cores, que contém todas as cores geradas no formato HSL.

    Resumo da Função

    A função gerarCores() é responsável por criar um conjunto de cores distintas em formato HSL, distribuídas uniformemente ao longo do espectro de cores. A quantidade de cores geradas é definida pelo parâmetro num.

    Relação com o Componente

    A função gerarCores() é utilizada, por exemplo, na função gerarGrafico() para definir as cores das barras em um gráfico de despesas. Quando o gráfico é gerado, cada categoria de despesa pode ter uma cor distinta, o que melhora a visualização e a diferenciação entre as categorias.
  */
  private gerarCores(num: number): string[] {
    const cores = [];
    for (let i = 0; i < num; i++) {
      const cor = `hsl(${(i * 360) / num}, 100%, 50%)`;
      cores.push(cor);
    }
    return cores;
  }
}
