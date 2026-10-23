import { Component, inject, signal } from '@angular/core';
import { CustomButtonComponent } from '../../components/custom-button/custom-button.component/custom-button.component';
import { Router } from '@angular/router';
import { Logo } from '../../components/logo/logo';
import { FairRundeStore } from '../../store/fair-runde.store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CustomButtonComponent, Logo, CommonModule, FormsModule],
  selector: 'app-page-start',
  styleUrl: './page-start.scss',
  templateUrl: './page-start.html',
})

export class PageStart {
  private router = inject(Router);
  readonly store = inject(FairRundeStore);

  zeigeFormular = signal(false);
  neuerGruppenName = '';

  startNeu() {
    const name = this.neuerGruppenName.trim();

    if (!name) return;
    
    const erfolg = this.store.neueRundeStarten(name);

    if (erfolg) {
      this.neuerGruppenName = '';
      this.zeigeFormular.set(false);
      this.router.navigate(['/neue-runde']);
    }
  }

  alteRundeOeffnen(id: string) {
    this.store.alteRundeLaden(id);
    this.router.navigate(['/summary']);
  }

  loescheRunde(id: string) {
    this.store.alteRundeLoeschen(id);
  }
}
