import { Component, signal } from '@angular/core';
import { PageStart } from './pages/page-start/page-start';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  standalone: true,
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('feirGeteilt');
}
