import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DespesasComponent } from './despesas/despesas.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    DespesasComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'controle-despesas-angular';
}
