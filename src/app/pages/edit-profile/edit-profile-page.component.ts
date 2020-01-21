import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {User} from '../../models/user.model';
import {Observable} from 'rxjs/Observable';
import {MetaService} from '../../services/meta.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../reducers/app-state-reducer';
import {UserService} from '../../services/user.service';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Ng2ImgMaxService} from 'ng2-img-max';

import * as TopMenuActions from '../../reducers/top-menu/top-menu.actions';
import * as CurrentPageActions from '../../reducers/current-page/current-page.actions';
import * as LoggedInUserActions from '../../reducers/logged-in-user/logged-in-user.actions';
import {BsModalRef, BsModalService, ModalDirective} from 'ngx-bootstrap';
import {AlertService} from '../../services/alert.service';
import {AlertType} from '../../models/alert.model';

@Component({
    selector: 'edit-profile-page',
    templateUrl: './edit-profile-page.component.html',
    styleUrls: ['./edit-profile-page.component.scss']
})

export class EditProfilePageComponent implements OnInit {
    @ViewChild('profilePhoto')
    public profilePhoto: ElementRef;

    @ViewChild('coverPhoto')
    public coverPhoto: ElementRef;

    @ViewChild('currentPasswordModal')
    public currentPasswordModal: ModalDirective;

    public user: User;
    public loggedInUser$: Observable<User>;
    public profileForm: FormGroup;
    public topics: any[];
    public isLoading = false;

    public changePasswordRef: BsModalRef;
    public passwordForm: FormGroup;
    public isUpdatePasswordLoading = false;

    public currentPassword: string;

    constructor(private _metaService: MetaService, private _store: Store<AppState>, private _userService: UserService,
        private _ng2ImgMaxService: Ng2ImgMaxService, private _router: Router, private _modalService: BsModalService,
        private _alertService: AlertService) {
        this._store.dispatch(new TopMenuActions.SetTopMenuStyle('normal'));
        this._store.dispatch(new CurrentPageActions.SetCurrentPage('edit-profile'));
        this.loggedInUser$ = this._store.select(state => state.loggedInUser);
    }

    private _updateUserInfo(): void {
        this.isLoading = true;
        this._userService.updateUser(this.user, this.currentPassword).subscribe({
            next: user => {
                this.isLoading = false;
                user.roles = this.user.roles;
                this._store.dispatch(new LoggedInUserActions.SetLoggedInUser(user));
                this._router.navigate(['/profile', this.user.username]).then(() => {
                    this._alertService.alert(AlertType.Success, 'Update user information successfully !');
                });
            }
        });
    }

    ngOnInit(): void {
        this.currentPassword = '';

        this.profileForm = new FormGroup({
            'name': new FormControl(null, [Validators.required]),
            'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmail.bind(this)),
            'description': new FormControl(),
            'topics': new FormArray([])
        });

        this.loggedInUser$.subscribe({
            next: user => {
                this.user = user;
                if (this.user) {
                    this._metaService.setTitle(this.user.name);
                    this.profileForm.patchValue({'email': this.user.email});
                }

                this._userService.getInterestingTopics().subscribe({
                    next: topics => {
                        this.topics = topics;
                        if (this.user) {
                            for (let topic of this.topics) {
                                const selected = this.user.topics.indexOf(topic.id) > -1;
                                (<FormArray>this.profileForm.get('topics')).push(new FormControl(selected));
                            }
                        }
                    }
                });
            }
        });

        let passwordMatchValidator = function (fg: FormGroup) {
            return fg.get('newPassword').value === fg.get('confirmNewPassword').value ? null : {'mismatch': true};
        }
        this.passwordForm = new FormGroup({
            'currentPassword': new FormControl(null, [Validators.required]),
            'newPassword': new FormControl(null, [Validators.required, Validators.minLength(6)]),
            'confirmNewPassword': new FormControl(null, [Validators.required])
        }, passwordMatchValidator);
    }

    getControls(frmGrp: FormGroup, key: string) {
        return (<FormArray>frmGrp.controls[key]).controls;
    }

    fileChange(input, userField: string, imgEle, maxWidth: number = 1000, maxHeight: number = 800) {
        let parentElement = imgEle.parentElement;
        let loadingElement = document.createElement('i');
        loadingElement.classList.add('fa');
        loadingElement.classList.add('fa-spinner');
        loadingElement.classList.add('fa-spin');
        parentElement.appendChild(loadingElement);

        let reader = new FileReader();
        this._ng2ImgMaxService.resize([input.files[0]], maxWidth, maxHeight).subscribe(
            (fileResult) => {
                // Start reading this file
                this.readFile(fileResult, reader, (result) => {
                    imgEle.src = result;
                    this._userService.uploadProfilePhoto(result.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), input.files[0].name)
                        .subscribe({
                            next: (response: { fid: number }) => {
                                this.user[userField] = response.fid;

                                this._userService.updateUser(this.user).subscribe(
                                    () => {
                                        parentElement.removeChild(loadingElement);
                                    }
                                );
                            }
                        });
                });
            }
        );
    }

    readFile(file, reader, callback) {
        reader.onload = () => {
            callback(reader.result);
        }
        reader.readAsDataURL(file);
    }

    onSubmit(): void {
        if (this.profileForm.valid && this.profileForm.touched) {
            if ((this.profileForm).get('email').value !== this.user.email) {
                this.currentPasswordModal.show();
            } else {
                this._updateUserInfo();
            }
        }
    }

    onChange(topicId: number, isChecked: boolean) {
        if (isChecked) {
            this.user.topics.push(topicId);
        } else {
            const indexOf = this.user.topics.indexOf(topicId);
            this.user.topics.splice(indexOf, 1);
        }
    }

    backToProfilePage(): void {
        this._router.navigate(['/profile', this.user.username]);
    }

    forbiddenEmail(control: FormControl): Promise<any> {
        const q = new Promise((resolve, reject) => {
            setTimeout(() => {
                this._userService.getUser(control.value).subscribe((user) => {
                    if (user.id !== this.user.id) {
                        resolve({'valueIsForbidden': true});
                    } else {
                        resolve(null);
                    }
                }, () => {
                    resolve(null);
                });
            }, 1500);
        });

        return q;
    }

    onUpdatePasswordSubmit(): void {
        this._alertService.clear();
        if (this.passwordForm.valid && this.passwordForm.touched) {
            this.isUpdatePasswordLoading = true;
            this._userService.updatePassword(this.user.id, this.passwordForm.get('currentPassword').value, this.passwordForm.get('newPassword').value).subscribe({
                next: (response: any) => {
                    this.isUpdatePasswordLoading = false;
                    this._alertService.success('Update Password successfully!');
                    this.passwordForm.reset();
                }, error: (response: any) => {
                    this.isUpdatePasswordLoading = false;
                    if (response.error.message.indexOf('Your current password is missing or incorrect; it\'s required to change the Password.') > -1) {
                        this._alertService.error('Current password is not correct!');
                    } else {
                        this._alertService.error(response.error.message);
                    }
                }
            });
        }
    }

    showChangePasswordForm(changePasswordForm: TemplateRef<any>): void {
        this.changePasswordRef = this._modalService.show(changePasswordForm);
    }

    onUpdateCurrentPasswordSubmit(): void {
        this.user.email = this.profileForm.get('email').value;
        this.isLoading = true;
        this._userService.updateUser(this.user, this.currentPassword).subscribe({
            next: user => {
                this.isLoading = false;
                user.roles = this.user.roles;
                this._store.dispatch(new LoggedInUserActions.SetLoggedInUser(user));
                this._router.navigate(['/profile', this.user.username]).then(() => {
                    this._alertService.alert(AlertType.Success, 'Update user information successfully !');
                });
            },
            error: response => {
                this.isLoading = false;
                let message = response.error.message;
                if (message.indexOf('Your current password is missing or incorrect') > -1) {
                    message = 'Your current password is incorrect';
                }
                this._alertService.clear();
                this._alertService.error(message);
            }
        });
    }
}