import { Component, Input, Output, EventEmitter, input, output } from '@angular/core';

@Component({
  imports: [],
  standalone: true,
  selector: 'app-custom-button-component',
  styleUrl: './custom-button.component.scss',
  templateUrl: './custom-button.component.html',
})
export class CustomButtonComponent {
  readonly label = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly buttonClass = input<string>('custom-btn');
  readonly btnClick = output<void>();

  onClick() {
    if (!this.disabled()) {
      this.btnClick.emit();
    }
  }
}
