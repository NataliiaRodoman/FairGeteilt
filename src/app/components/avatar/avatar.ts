import { Component, computed, input, Input } from '@angular/core';
import { Person } from '../../models/model';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  standalone: true,
  selector: 'avatar-component',
  styleUrl: './avatar.scss',
  templateUrl: './avatar.html',
})
export class Avatar {
  readonly name = input.required<string>();
  readonly teilnahmer = input<Person[]>([]); 
  readonly initial = computed(() => this.name().charAt(0).toUpperCase());
  readonly farbClass = computed(() => this.teilnahmer().find(p => p.name === this.name())?.farbAvatar ?? 'color-0');
}

