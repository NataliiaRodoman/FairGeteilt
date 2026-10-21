import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Person } from '../../models/model';
import { CommonModule } from '@angular/common';
import { CustomButtonComponent } from '../../components/custom-button/custom-button.component/custom-button.component';
import { Avatar } from '../../components/avatar/avatar';
import { FairRundeStore } from '../../store/fair-runde.store';

@Component({
  imports: [CommonModule, FormsModule, CustomButtonComponent, Avatar],
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

  personEntvernen(id: string) {
    this.store.personEntvernen(id);
  }

  // personHinzufuegen() {
  //   const name = this.neuerName.trim();

  //   if (!name) return;

  //   const bereitsVorhanden = this.teilnahmer.some((person)=> person.name.toLocaleLowerCase() === name.toLocaleLowerCase(),);

  //   if (bereitsVorhanden) return;

  //   const farbIndex = this.teilnahmer.length % 5;

  //   this.teilnahmer = [
  //     ...this.teilnahmer,
  //     {
  //       id: crypto.randomUUID(),
  //       name,
  //       farbAvatar: `color-${farbIndex}`
  //   }];

  //   localStorage.setItem('teilnahmer', JSON.stringify(this.teilnahmer));
  //   localStorage.setItem('gruppenName', this.gruppenName);

  //   this.neuerName ='';
  // }

  // personEntvernen(id: string) {
  //   this.teilnahmer = this.teilnahmer.filter((person => person.id !== id));

  //   localStorage.setItem('teilnahmer',JSON.stringify(this.teilnahmer));
  // }

  weiter(){
    //localStorage.setItem('gruppenName', this.gruppenName);
    this.router.navigate(['/ausgaben']);
  }
}
