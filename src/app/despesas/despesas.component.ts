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

  constructor() {
    this.carregarDespesas();
  }

  ngAfterViewInit() {
    this.gerarGrafico();
  }

  adicionarDespesa() {
    if (this.descricao && this.valor && this.categoria) {
      const novaDespesa = { descricao: this.descricao, valor: this.valor, categoria: this.categoria };
      if (this.indexEdicao !== null) {
        this.despesas[this.indexEdicao] = novaDespesa; // Atualiza a despesa existente
        this.indexEdicao = null; // Reseta o índice de edição
        this.botaoTexto = 'Adicionar Despesa'; // Reseta o texto do botão
      } else {
        this.despesas.push(novaDespesa); // Adiciona uma nova despesa
      }
      this.resetForm();
      this.salvarDespesas();
      this.gerarGrafico();
    }
  }

  editarDespesa(index: number) {
    const despesa = this.despesas[index];
    this.descricao = despesa.descricao;
    this.valor = despesa.valor;
    this.categoria = despesa.categoria;
    this.indexEdicao = index; // Armazena o índice da despesa em edição
    this.botaoTexto = 'Atualizar Despesa'; // Altera o texto do botão
  }

  excluirDespesa(index: number) {
    this.despesas.splice(index, 1);
    this.salvarDespesas();
    this.gerarGrafico();
  }

  salvarDespesas() {
    localStorage.setItem('despesas', JSON.stringify(this.despesas));
  }

  carregarDespesas() {
    const despesasSalvas = localStorage.getItem('despesas');
    if (despesasSalvas) {
      this.despesas = JSON.parse(despesasSalvas);
    }
  }

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

  calcularValoresPorCategoria() {
    return this.categorias.map(cat =>
      this.despesas
        .filter(d => d.categoria === cat)
        .reduce((total, despesa) => total + despesa.valor, 0) || 0
    );
  }

  calcularTotal() {
    return this.despesas.reduce((total, despesa) => total + despesa.valor, 0);
  }

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

  private gerarCores(num: number): string[] {
    const cores = [];
    for (let i = 0; i < num; i++) {
      const cor = `hsl(${(i * 360) / num}, 100%, 50%)`;
      cores.push(cor);
    }
    return cores;
  }
}
