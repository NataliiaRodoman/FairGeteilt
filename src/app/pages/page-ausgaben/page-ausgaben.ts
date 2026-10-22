import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomButtonComponent } from '../../components/custom-button/custom-button.component/custom-button.component';
import { Avatar } from '../../components/avatar/avatar';
import { FairRundeStore } from '../../store/fair-runde.store';

@Component({
  imports: [CommonModule, FormsModule, CustomButtonComponent, Avatar],
  selector: 'app-page-ausgaben',
  styleUrl: './page-ausgaben.scss',
  templateUrl: './page-ausgaben.html',
})

export class PageAusgaben {
  private router = inject(Router);

  readonly store = inject(FairRundeStore);
  
  beschreibung = '';
  betrag: number | null = null;
  bezahltVon = this.store.teilnahmer()[0]?.id ?? '';

  get gesamt(): number {
    return this.store.ausgaben().reduce((summe,ausgabe) => summe + ausgabe.betrag, 0);
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
  }

  nameVon(id:string): string {
    return this.store.teilnahmer().find((person) => person.id === id)?.name ?? 'Unbekannt';
  }

  ausgabeEntfernen(id: string) {
    this.store.ausgabeEntfernen(id);
  }

  zuruk() {
    this.router.navigate(['/neue-runde']);
  }

  weiter() {
    this.router.navigate(['/summary']);
  }
}
