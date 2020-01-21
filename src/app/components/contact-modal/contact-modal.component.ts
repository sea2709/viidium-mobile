import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {AlertService} from '../../services/alert.service';

@Component({
    selector: 'contact-modal',
    templateUrl: 'contact-modal.component.html',
    styleUrls: ['./contact-modal.component.scss']
})
export class ContactModalComponent implements OnInit {
    @ViewChild('contactModal')
    contactModal: ElementRef;

    public contactForm: FormGroup;
    public modalRef: BsModalRef;
    public isLoading = false;

    constructor(private _modalService: BsModalService, private _userService: UserService, private _alertService: AlertService) {}

    ngOnInit() {
        this.contactForm = new FormGroup({
            'name': new FormControl(null, Validators.required),
            'email': new FormControl(null, [Validators.required, Validators.email]),
            'subject': new FormControl(null, Validators.required),
            'message': new FormControl(null, Validators.required)
        });
    }

    showModal() {
        this.modalRef = this._modalService.show(this.contactModal);
    }

    hideModal() {
        this._alertService.clear();
        this.contactForm.reset();
        this.modalRef.hide();
        this.modalRef = null;
    }

    onSubmitContact(): void {
        this.isLoading = true;
        this._alertService.clear();
        this._userService.submitContact(this.contactForm.get('name').value, this.contactForm.get('email').value,
            this.contactForm.get('subject').value, this.contactForm.get('message').value).subscribe({
            next: (response: any) => {
                this.isLoading = false;
                if (response.sid) {
                    this._alertService.success('Thank you for your submission ! We will contact you soon !');
                    this.contactForm.reset();
                }
            },
            error: (errorRes: any) => {
                this.isLoading = false;
                this._alertService.error(errorRes.error.message);
            }
        });
    }
}
