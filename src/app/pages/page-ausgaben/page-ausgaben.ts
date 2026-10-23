import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomButtonComponent } from '../../components/custom-button/custom-button.component/custom-button.component';
import { Avatar } from '../../components/avatar/avatar';
import { FairRundeStore } from '../../store/fair-runde.store';
import { Logo } from '../../components/logo/logo';

@Component({
  imports: [CommonModule, FormsModule, CustomButtonComponent, Avatar, Logo],
  standalone: true,
  selector: 'app-page-ausgaben',
  styleUrl: './page-ausgaben.scss',
  templateUrl: './page-ausgaben.html',
})

export class PageAusgaben {
  private router = inject(Router);
  readonly store = inject(FairRundeStore);
  
  beschreibung = '';
  betrag: number | null = null;
  private _bezahltVon = '';

  get bezahltVon(): string{
    if (!this._bezahltVon && this.store.teilnahmer().length > 0) {
      return this.store.teilnahmer()[0].id;
    }
    return this._bezahltVon;
  } 

  set bezahltVon(value: string) {
    this._bezahltVon = value;
  }

  nameVon(id:string): string {
    const person = this.store.teilnahmer().find((p) => p.id === id);

    return person ? person.name : 'Unbekannt';
  }

  ausgabeHinzufuegen() {
    const text = this.beschreibung.trim();
    const summe = Number(this.betrag);

    if (!text || !Number.isFinite(summe) || summe<=0 || !this.bezahltVon) {
      return
    }
    
    this.store.ausgabeHinzufuegen(text, summe, this.bezahltVon);
    this.beschreibung = '';
    this.betrag = null;
    this._bezahltVon = '';
  }

  ausgabeEntfernen(id: string) {
    this.store.entfernenById('ausgaben', id);
  }

  zuruk() {
    this.router.navigate(['/neue-runde']);
  }

  weiter() {
    this.router.navigate(['/summary']);
  }
}
