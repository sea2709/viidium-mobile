import {Component, Injector, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {AppState} from '../../reducers/app-state-reducer';
import {Store} from '@ngrx/store';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

import * as TopMenuActions from '../../reducers/top-menu/top-menu.actions';
import * as CurrentPageActions from '../../reducers/current-page/current-page.actions';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'register-page',
    templateUrl: './register-page.component.html',
    styleUrls: ['./register-page.component.scss']
})

export class RegisterPageComponent implements OnInit {
    public signupForm: FormGroup;
    public topics: any[];
    public isValidRegCode = false;
    public invalidRegCodeMsg: string;
    public error: any;
    public isLoading = false;

    private _regCode: string;

    constructor(public userService: UserService, private _authService: AuthService, private _store: Store<AppState>,
                private _router: Router, private _route: ActivatedRoute) {
        this._store.dispatch(new TopMenuActions.SetTopMenuStyle('normal'));
        this._store.dispatch(new CurrentPageActions.SetCurrentPage('register'));
    }

    private _initialize(): void {
        let passwordMatchValidator = function(fg: FormGroup) {
            return fg.get('password').value === fg.get('confirm_password').value ? null : { 'mismatch': true };
        }

        this.signupForm = new FormGroup({
            'name': new FormControl(null, [Validators.required]),
            'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenUsernameOrEmail.bind(this)),
            'username': new FormControl(null, [Validators.required], this.forbiddenUsernameOrEmail.bind(this)),
            'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
            'confirm_password': new FormControl(null, [Validators.required]),
            'description': new FormControl(),
            'topics': new FormArray([])
        }, passwordMatchValidator);

        this.userService.getInterestingTopics().subscribe({
            next: topics => {
                this.topics = topics;
                for (let topic of this.topics) {
                    (<FormArray>this.signupForm.get('topics')).push(new FormControl(null));
                }
            }
        });
    }

    ngOnInit(): void {
        if (this._authService.isLoggedIn()) {
            this._router.navigate(['/']);
        } else {
            this._route.params.subscribe(params => {
                this._regCode = params['regCode'];
                this.userService.acceptInvitation(this._regCode).subscribe({
                    next: (response: any) => {
                        if (response.result === '1') {
                            this.isValidRegCode = true;
                            this._initialize();
                        }
                    },
                    error: (response: any) => {
                        if (response.error) {
                            this.invalidRegCodeMsg = response.error.message;
                        }
                    }
                });
            });
        }
    }

    onSubmit(): void {
        let topicIds = [];
        let idx = 0;
        for (let topicControl of (<FormArray>this.signupForm.get('topics')).controls) {
            if (topicControl.value) {
                topicIds.push(this.topics[idx].id);
            }
        }
        this.error = null;
        this.isLoading = true;
        this.userService.register(this.signupForm.get('name').value, this.signupForm.get('email').value,
            this.signupForm.get('username').value, this.signupForm.get('password').value,
            this.signupForm.get('description').value, topicIds, this._regCode).subscribe({
            next: user => {
                this._authService.login(this.signupForm.get('username').value, this.signupForm.get('password').value).subscribe(
                    () => {
                        this.userService.getLoggedInUser().subscribe({
                            next: loggedInUser => {
                                this.isLoading = false;
                                this._router.navigate(['/profile', user.username]);
                            }
                        });
                    }
                );
            },
            error: (response: any) => {
                this.isLoading = false;
                this.error = response.error;
            }
        });
    }

    getControls(frmGrp: FormGroup, key: string) {
        return (<FormArray>frmGrp.controls[key]).controls;
    }

    forbiddenUsernameOrEmail(control: FormControl): Promise<any> {
        const q = new Promise((resolve, reject) => {
            setTimeout(() => {
                this.userService.getUser(control.value).subscribe(() => {
                    resolve({'valueIsForbidden': true});
                }, () => {
                    resolve(null);
                });
            }, 1500);
        });

        return q;
    }
}
