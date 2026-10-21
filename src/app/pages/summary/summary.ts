import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomButtonComponent } from '../../components/custom-button/custom-button.component/custom-button.component';
import { Router } from '@angular/router';
import { Ausgabe, Person } from '../../models/model';
import { Avatar } from '../../components/avatar/avatar';

@Component({
  imports: [CommonModule, FormsModule, CustomButtonComponent, Avatar],
  selector: 'app-summary',
  styleUrl: './summary.scss',
  templateUrl: './summary.html',
})
export class Summary {

  private router = inject(Router);

  gruppenName: string = localStorage.getItem('gruppenName') ?? '';
  teilnahmer: Person[] = JSON.parse(localStorage.getItem('teilnahmer') ?? '[]');
  ausgaben: Ausgabe[] = JSON.parse(localStorage.getItem('ausgaben') ?? '[]');

  get gesamt(): number {
    const cent = this.ausgaben.reduce(
      (summe,ausgabe) => summe + Math.round(Number(ausgabe.betrag)*100),
      0,
    );
    return cent / 100;
  }

  get anteilProPerson(): number {
    return this.teilnahmer.length > 0
      ? this.gesamt / this.teilnahmer.length
      : 0;
  }

  get abrechnung(): {von: string; an: string; bertrag: number}[]{
    const anzahl = this.teilnahmer.length;

    if (anzahl < 2 || this.ausgaben.length === 0){
      return [];
    }
    
    const gesamtCent = this.ausgaben.reduce(
      (summe,ausgabe) => summe + Math.round(Number(ausgabe.betrag)*100),
      0,
    );
    const grundAnteil=Math.floor(gesamtCent/anzahl);
    const restCent = gesamtCent % anzahl;
    const salden = new Map<string,number>();

    this.teilnahmer.forEach((person,index) => {
      const anteil = grundAnteil + (index < restCent ? 1:0);

      salden.set(person.id,-anteil);
    })

    for (const ausgabe of this.ausgaben) {
      const payer = salden.get(ausgabe.bezahltVon);

      if (payer === undefined) continue;
      const betragCent = Math.round(Number(ausgabe.betrag)*100);

      salden.set(ausgabe.bezahltVon, payer + betragCent);
    }

    const schuldner = [...salden.entries()]
    .filter(([,saldo])=> saldo < 0)
    .map(([id,saldo]) =>({id, cent: -saldo}));

    const glaeubiger = [...salden.entries()]
    .filter(([,saldo])=> saldo > 0)
    .map(([id,saldo]) =>({id, cent:  saldo}));

    const ergebnis: { von: string, an:string, bertrag: number}[] = [];
    
    let i=0;
    let j=0;

    while (i<schuldner.length && j < glaeubiger.length) {
      const cent = Math.min(schuldner[i].cent, glaeubiger[j].cent);

      if (cent>0) {
        ergebnis.push({
          von: this.nameVon(schuldner[i].id),
          an: this.nameVon(glaeubiger[j].id),
          bertrag: cent / 100,
        })
      }

      schuldner[i].cent -= cent;
      glaeubiger[j].cent -= cent;

      if (schuldner[i].cent === 0) i++;
      if (glaeubiger[j].cent === 0) j++;
    }
    return ergebnis;
  }

  nameVon(id: string): string{
    const person = this.teilnahmer.find((p)=> p.id === id);
    return person ? person.name : 'Unbekannt';
  }

  zuruk() {
    this.router.navigate(['/ausgaben']);
  }

  weiter() {
    localStorage.removeItem('gruppenName');
    localStorage.removeItem('teilnahmer');
    localStorage.removeItem('ausgaben');

    this.router.navigate(['/']);
  }
}
