import { Component, inject } from '@angular/core';
import { CustomButtonComponent } from '../../components/custom-button/custom-button.component/custom-button.component';
import { Router } from '@angular/router';

@Component({
  imports: [CustomButtonComponent],
  selector: 'app-page-start',
  styleUrl: './page-start.scss',
  templateUrl: './page-start.html',
})
export class PageStart {
   private router = inject(Router);

  neueRundeStarten() {
   this.router.navigate(['/neue-runde']);
  }
}
