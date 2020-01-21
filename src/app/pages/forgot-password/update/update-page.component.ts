import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {AlertService} from '../../../services/alert.service';

@Component({
    selector: 'update-page',
    templateUrl: './update-page.component.html',
    styleUrls: ['./update-page.component.scss']
})

export class ForgotUpdatePageComponent implements OnInit {
    private _userId: number;
    private _hash: string;

    public timestamp: number;
    public passwordForm: FormGroup;
    public isUpdatePasswordLoading = false;
    public updatePassSuccessfully = false;

    public loginForm: FormGroup;
    public isLoginLoading = false;

    constructor(private _userService: UserService, private _authService: AuthService, private _route: ActivatedRoute,
        private _router: Router, private _alertService: AlertService) {
    }

    ngOnInit(): void {
        this._route.params.subscribe(params => {
            this._userId = +params['userId'];
            this.timestamp = +params['timestamp'];
            this._hash = params['hash'];
        });

        let passwordMatchValidator = function(fg: FormGroup) {
            return fg.get('newPassword').value === fg.get('confirmNewPassword').value ? null : { 'mismatch': true };
        }

        this.passwordForm = new FormGroup({
            'newPassword': new FormControl(null, [Validators.required, Validators.minLength(6)]),
            'confirmNewPassword': new FormControl(null, [Validators.required])
        }, passwordMatchValidator);

        this.loginForm = new FormGroup({
            'username': new FormControl(null, [Validators.required]),
            'password': new FormControl(null, [Validators.required])
        });
    }

    onUpdatePasswordSubmit(): void {
        this.updatePassSuccessfully = false;
        this._alertService.clear();
        if (this.passwordForm.valid && this.passwordForm.touched) {
            this.isUpdatePasswordLoading = true;
            this._userService.updatePassword2(this._userId, this.timestamp, this._hash, this.passwordForm.get('newPassword').value).subscribe({
                next: (response: any) => {
                    this.isUpdatePasswordLoading = false;
                    this.updatePassSuccessfully = response.result;

                    if (this.updatePassSuccessfully) {
                        this._alertService.success('Update Password successfully. Please login by the new password!');
                        this.loginForm.reset();
                        setTimeout(() => {
                            let usernameInput = <HTMLInputElement>document.getElementById('username');
                            let passwordInput = <HTMLInputElement>document.getElementById('password');
                            usernameInput.value = '';
                            passwordInput.value = '';
                        }, 1000);
                    }
                }, error: (response: any) => {
                    this.isUpdatePasswordLoading = false;
                    this._alertService.error(response.error.message);
                }
            });
        }
    }

    onLoginSubmit(): void {
        this._alertService.clear();
        this.isLoginLoading = true;
        this._authService.login(this.loginForm.get('username').value, this.loginForm.get('password').value).subscribe(
            () => {
                this._userService.getLoggedInUser().subscribe({
                    next: user => {
                        this.isLoginLoading = false;
                        this._router.navigate(['/profile', user.username]);
                    },
                    error: errors => {
                        this.isLoginLoading = false;
                        this._alertService.error('Login unsuccessfully !');
                    }
                });
            },
            () => {
                this._alertService.error('Login unsuccessfully !');
                this.isLoginLoading = false;
            }
        );
    }
}