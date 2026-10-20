import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Person } from '../../models/model';
import { CommonModule } from '@angular/common';
import { CustomButtonComponent } from '../../components/custom-button/custom-button.component/custom-button.component';

@Component({
  imports: [CommonModule, FormsModule, CustomButtonComponent],
  standalone: true,
  selector: 'app-page-fair-runde',
  styleUrl: './page-fair-runde.scss',
  templateUrl: './page-fair-runde.html',
})

export class PageFairRunde {
  private router = inject(Router);
  neuerName: string = '';
  gruppenName: string = history.state?.gruppenName ?? '';
  teilnahmer: Person[] = history.state?.teilnahmer ?? [];

  personHinzufuegen() {
    const name = this.neuerName.trim();
    if (!name) return;

    const bereitsVorhanden = this.teilnahmer.some((person)=> person.name.toLocaleLowerCase() === name.toLocaleLowerCase(),);

    if (bereitsVorhanden) return;

    this.teilnahmer.push({
      id: crypto.randomUUID(),
      name,
    });

    this.neuerName ='';
  }

  personEntvernen(id: string) {
    this.teilnahmer = this.teilnahmer.filter((person => person.id !== id));
  }

  weiter(){
    this.router.navigate(['/ausgaben'], {
      state: {
        gruppenName: this.gruppenName,
        teilnahmer: this.teilnahmer,
      }
    });
  }
}
