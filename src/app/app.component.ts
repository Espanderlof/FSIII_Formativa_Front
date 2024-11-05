import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './shared/alert/alert.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AlertComponent
  ],
  template: `
    <app-alert></app-alert>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" href="#">Biblioteca</a>
      </div>
    </nav>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'biblioteca';
}