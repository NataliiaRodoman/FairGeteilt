import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomButtonComponent } from '../../components/custom-button/custom-button.component/custom-button.component';
import { Router } from '@angular/router';
import { Avatar } from '../../components/avatar/avatar';
import { FairRundeStore } from '../../store/fair-runde.store';
import { Logo } from '../../components/logo/logo';

@Component({
  imports: [CommonModule, FormsModule, CustomButtonComponent, Avatar, Logo],
  selector: 'app-summary',
  styleUrl: './summary.scss',
  templateUrl: './summary.html',
})

export class Summary {

  private router = inject(Router);
  readonly store = inject(FairRundeStore);

  zuruk() {
    this.router.navigate(['/ausgaben']);
  }

  weiter() {
    this.store.rundeZuruecksetzen();
    this.router.navigate(['/']);
  }
}
