import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Alert {
    type: 'success' | 'danger' | 'warning' | 'info';
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    private alertSource = new Subject<Alert>();
    alert$ = this.alertSource.asObservable();

    showAlert(alert: Alert): void {
        this.alertSource.next(alert);
    }
}