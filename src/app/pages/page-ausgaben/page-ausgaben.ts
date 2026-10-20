import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Ausgabe, Person } from '../../models/model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomButtonComponent } from '../../components/custom-button/custom-button.component/custom-button.component';

@Component({
  imports: [CommonModule,FormsModule, CustomButtonComponent],
  selector: 'app-page-ausgaben',
  styleUrl: './page-ausgaben.scss',
  templateUrl: './page-ausgaben.html',
})

export class PageAusgaben {
  private router = inject(Router);

  gruppenName: string = history.state?.gruppenName ?? '';
  teilnahmer: Person[] = history.state?.teilnahmer ?? [];
  beschreibung = '';
  betrag: number | null = null;
  bezahltVon = this.teilnahmer[0]?.id ?? '';
  ausgaben: Ausgabe[] =history.state?.ausgaben ?? [];

  get gesamt(): number {
    return this.ausgaben.reduce((summe,ausgabe) => summe + ausgabe.betrag, 0);
  }

  ausgabeHinzufuegen() {
    const text = this.beschreibung.trim();
    const summe = Number(this.betrag);

    if (!text || !Number.isFinite(summe) || summe<=0 || !this.bezahltVon) {
      return
    }

    this.ausgaben.push({
      id: crypto.randomUUID(),
      beschreibung: text,
      betrag: summe,
      bezahltVon: this.bezahltVon,
    })

    this.beschreibung = '';
    this.betrag = null;
  }

  nameVon(id:string): string {
    return this.teilnahmer.find((person) => person.id === id)?.name ?? 'Unbekannt';
  }

  ausgabeEntfernen(id: string) {
    this.ausgaben = this.ausgaben.filter((ausgabe) => ausgabe.id !== id);
  }
  zuruk() {
    this.router.navigate(['/neue-runde'],{
      state: {
        gruppenName: this.gruppenName,
        teilnahmer: this.teilnahmer,
        ausgaben: this.ausgaben,
      },
    });
  }

  weiter() {
    this.router.navigate(['/summary'],{
      state: {
        gruppenName: this.gruppenName,
        teilnahmer: this.teilnahmer,
        ausgaben: this.ausgaben,
      },
    })
  }
}
