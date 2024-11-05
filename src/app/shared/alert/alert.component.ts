// src/app/shared/alert/alert.component.ts
import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="message" class="alert alert-{{type}} alert-dismissible fade show position-fixed top-0 end-0 m-3" role="alert">
      {{message}}
      <button type="button" class="btn-close" (click)="message = ''"></button>
    </div>
  `,
  styles: [
    `.alert { z-index: 1050; max-width: 400px; }`
  ]
})
export class AlertComponent implements OnDestroy {
  message: string = '';
  type: string = 'info';
  private subscription: Subscription;

  constructor(private alertService: AlertService) {
    this.subscription = this.alertService.alert$.subscribe(alert => {
      this.message = alert.message;
      this.type = alert.type;
      setTimeout(() => this.message = '', 5000); // Auto-cerrar después de 5 segundos
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}