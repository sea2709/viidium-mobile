import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../services/user.service';
import {AlertService} from '../../../services/alert.service';

@Component({
    selector: 'start-page',
    templateUrl: './start-page.component.html',
    styleUrls: ['./start-page.component.scss']
})

export class ForgotStartPageComponent implements OnInit {
    public forgotPasswordForm: FormGroup;
    public recaptchaSuccessfully = false;
    public isLoading = false;
    public sendResetPassSuccessfully = false;

    constructor(private _userService: UserService, private _alertService: AlertService) {
    }

    ngOnInit(): void {
        this.forgotPasswordForm = new FormGroup({
            'username': new FormControl(null, [Validators.required])
        });
    }

    handleCorrectCaptcha($event): void {
        this.recaptchaSuccessfully = true;
    }

    onSubmit(): void {
        this._alertService.clear();
        this.isLoading = true;
        this._alertService.clear();
        this._userService.forgotPassword(this.forgotPasswordForm.get('username').value).subscribe({
            next: (response: any) => {
                this.isLoading = false;
                if (response.result) {
                    this._alertService.success('Sent email to reset password successfully. Please check your email!');
                    this.forgotPasswordForm.reset();
                }
            },
            error: response => {
                this.isLoading = false;
                this._alertService.error(response.error.message);
            }
        })
    }
}
