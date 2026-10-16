import { Component, inject } from '@angular/core';
import { CustomButtonComponent } from '../../components/custom-button/custom-button.component/custom-button.component';
import { CommonModule, Location as AngularLocation } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  imports: [CustomButtonComponent, CommonModule, FormsModule],
  selector: 'app-page-fair-runde',
  styleUrl: './page-fair-runde.scss',
  templateUrl: './page-fair-runde.html',
})
export class PageFairRunde {
   private location = inject(AngularLocation); 
  private router = inject(Router);
  eventName: string = '';
  currentParticipant: string = '';
  participants: string[] = [];

   goBack() {
    this.router.navigate(['/']);
  }

  addParticipant() {
    if (this.currentParticipant.trim() !== '') {
      this.participants.push(this.currentParticipant.trim());
      this.currentParticipant = ''; 
    }
  }
    
  createRound() {
    if (!this.eventName.trim()) {
     alert('Bitte gib einen Event-Namen ein!');
      return;
    }
    if (this.participants.length === 0) {
      alert('Bitte füge mindestens einen Teilnehmer hinzu!');
      return;
    }
    
    
  }
}
