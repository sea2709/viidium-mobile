import {Component, OnInit, Input} from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {Alert, AlertType} from '../../models/alert.model';

@Component({
    selector: 'viidia-alert',
    templateUrl: 'viidia-alert.component.html',
    styleUrls: ['./viidia-alert.component.scss']
})

export class ViidiaAlertComponent implements OnInit {
    alerts: Alert[] = [];

    @Input()
    timeout: number = null;

    @Input()
    showCloseBtn: boolean = true;

    constructor(private _alertService: AlertService) {
    }

    ngOnInit() {
        this._alertService.getAlert().subscribe((alert: Alert) => {
            if (!alert) {
                // clear alerts when an empty alert is received
                this.alerts = [];
                return;
            }

            // add alert to array
            if (alert) {
                this.alerts.push(alert);
            }
        });

        if (this.timeout) {
            setTimeout(() => {
                for (const alert of this.alerts) {
                    this.removeAlert(alert);
                }
            }, this.timeout);
        }
    }

    removeAlert(alert: Alert) {
        this.alerts = this.alerts.filter(x => x !== alert);
    }

    cssClass(alert: Alert) {
        if (!alert) {
            return;
        }

        // return css class based on alert type
        switch (alert.type) {
            case AlertType.Success:
                return 'alert alert-success';
            case AlertType.Error:
                return 'alert alert-danger';
            case AlertType.Info:
                return 'alert alert-info';
            case AlertType.Warning:
                return 'alert alert-warning';
        }
    }
}