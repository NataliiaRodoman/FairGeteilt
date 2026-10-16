import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  imports: [],
  standalone: true,
  selector: 'app-custom-button-component',
  styleUrl: './custom-button.component.scss',
  templateUrl: './custom-button.component.html',
})
export class CustomButtonComponent {

  @Input() label: string = '';
  @Output() btnClick = new EventEmitter<void>();

  onClick() {
    this.btnClick.emit();
  }
}
