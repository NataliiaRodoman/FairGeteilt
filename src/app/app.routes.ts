import { Routes } from '@angular/router';
import { PageStart } from './pages/page-start/page-start';
import { PageFairRunde } from './pages/page-fair-runde/page-fair-runde';

export const routes: Routes = [
  { path: '', component: PageStart },              
  { path: 'neue-runde', component: PageFairRunde }, 
  { path: '**', redirectTo: '' } 
];
