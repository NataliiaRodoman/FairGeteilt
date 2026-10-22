import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomButtonComponent } from '../../components/custom-button/custom-button.component/custom-button.component';
import { Avatar } from '../../components/avatar/avatar';
import { FairRundeStore } from '../../store/fair-runde.store';
import { Logo } from '../../components/logo/logo';

@Component({
  imports: [CommonModule, FormsModule, CustomButtonComponent, Avatar, Logo],
  standalone: true,
  selector: 'app-page-fair-runde',
  styleUrl: './page-fair-runde.scss',
  templateUrl: './page-fair-runde.html',
})

export class PageFairRunde {
  private router = inject(Router);
  readonly store = inject(FairRundeStore);

  neuerName: string = '';
  
  get gruppenName(): string {
    return this.store.gruppenName();
  }

  set gruppenName(value:string) {
    this.store.updateGruppenName(value);
  }

  personHinzufuegen() {
    const name = this.neuerName.trim();

    if (!name) return;

    this.store.personHinzufuegen(name);
    this.neuerName ='';
  }

  personEntfernen(id: string) {
    this.store.entfernenById('teilnahmer', id);
  }

  weiter(){
    this.router.navigate(['/ausgaben']);
  }
}
