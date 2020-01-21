import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {AlertService} from '../../services/alert.service';

@Component({
    selector: 'invite-friend-modal',
    templateUrl: 'invite-friend-modal.component.html',
    styleUrls: ['./invite-friend-modal.component.scss']
})
export class InviteFriendModalComponent implements OnInit {
    @ViewChild('inviteModal')
    inviteModal: ElementRef;

    public inviteFriendForm: FormGroup;
    public modalRef: BsModalRef;
    public isLoading = false;

    constructor(private _modalService: BsModalService, private _userService: UserService, private _alertService: AlertService) {}

    ngOnInit() {
        this.inviteFriendForm = new FormGroup({
            'name': new FormControl(null, Validators.required),
            'email': new FormControl(null, [Validators.required, Validators.email]),
            'message': new FormControl()
        });
    }

    showModal() {
        this.modalRef = this._modalService.show(this.inviteModal);
    }

    hideModal() {
        this._alertService.clear();
        this.inviteFriendForm.reset();
        this.modalRef.hide();
        this.modalRef = null;
    }

    onSubmitInvitation(): void {
        this.isLoading = true;
        this._alertService.clear();
        this._userService.invite(this.inviteFriendForm.get('name').value,
            this.inviteFriendForm.get('email').value, this.inviteFriendForm.get('message').value).subscribe({
            next: (response: any) => {
                this.isLoading = false;
                if (response.id) {
                    this._alertService.success('Your invitation has been sent !');
                    this.inviteFriendForm.reset();
                }
            },
            error: (errorRes: any) => {
                this.isLoading = false;
                this._alertService.error(errorRes.error.message);
            }
        });
    }
}
