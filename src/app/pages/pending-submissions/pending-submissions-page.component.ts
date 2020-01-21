import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {User} from '../../models/user.model';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {AppState} from '../../reducers/app-state-reducer';
import {UserService} from '../../services/user.service';

import * as TopMenuActions from '../../reducers/top-menu/top-menu.actions';
import * as CurrentPageActions from '../../reducers/current-page/current-page.actions';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {AlertService} from '../../services/alert.service';

declare let moment: any;

@Component({
    selector: 'pending-submissions-page',
    templateUrl: './pending-submissions-page.component.html',
    styleUrls: ['./pending-submissions-page.component.scss']
})

export class PendingSubmissionsPageComponent implements OnInit {
    private _pageNumber = 1;
    private _submissionsPerPage = 20;
    private _total: number;

    public user: User;
    public loggedInUser$: Observable<User>;
    public submissions: any[] = [];
    public modalRef: BsModalRef;
    public activeSubmission: any;
    public isLoading = false;
    public isAddNoteLoading = false;
    public isApproveRejectLoading = false;
    public selectedSubmissionIds: number[] = [];

    @ViewChild('addNoteModal')
    private _addNoteModal: TemplateRef<any>;

    constructor(private _store: Store<AppState>, private _userService: UserService,
        private _modalService: BsModalService, private _alertService: AlertService) {
        this._store.dispatch(new TopMenuActions.SetTopMenuStyle('normal'));
        this._store.dispatch(new CurrentPageActions.SetCurrentPage('pending-submissions'));
        this.loggedInUser$ = this._store.select(state => state.loggedInUser);
    }

    private _loadPendingSubmissions(): void {
        this._userService.getAwaitingSubmittedArticles(this._pageNumber, this._submissionsPerPage).subscribe({
            next: response => {
                for (let submission of response.submissions) {
                    this.submissions.push(submission);
                }
                this._total = response.total;

                this.isLoading = false;
            }
        });
    }

    openModal(template: TemplateRef<any>) {
        this._modalService.onShow.subscribe((reason: string) => {
            setTimeout(() => {
                const noteEle = document.getElementById('note');
                if (noteEle) {
                    noteEle.focus();
                }
            });
        });

        this._modalService.onHide.subscribe((reason: string) => {
            this.activeSubmission = null;
        });

        this.modalRef = this._modalService.show(template);
    }

    ngOnInit(): void {
        this.loggedInUser$.subscribe({
            next: user => {
                this.user = user;
            }
        });

        this._loadPendingSubmissions();
    }

    approve(id: number): void {
        this.isApproveRejectLoading = true;
        this._userService.updateSubmissionStatus([id], 'approve').subscribe(() => {
            let idx = 0;
            for (let submission of this.submissions) {
                if (submission.id === id) {
                    this.submissions.splice(idx, 1);
                    break;
                }
                idx++;
            }

            this.isApproveRejectLoading = false;
        });
    }

    reject(id: number): void {
        this.isApproveRejectLoading = true;
        this._userService.updateSubmissionStatus([id], 'reject').subscribe(() => {
            let idx = 0;
            for (let submission of this.submissions) {
                if (submission.id === id) {
                    this.submissions.splice(idx, 1);
                    break;
                }
                idx++;
            }

            this.isApproveRejectLoading = false;
        });
    }

    note(id: number): void {
        for (let submission of this.submissions) {
            if (submission.id === id) {
                this.activeSubmission = submission;
                break;
            }
        }

        this.openModal(this._addNoteModal);
    }

    onAddNoteSubmit(): void {
        this.isAddNoteLoading = true;
        this._userService.updateSubmissionStatus([this.activeSubmission.id], 'note', this.activeSubmission.note).subscribe(() => {
            this.isAddNoteLoading = false;
            this._alertService.clear();
            this._alertService.success('The note has been added !!!');
        });
    }

    onScrollDown() {
        this.loadMore();
    }

    loadMore(): void {
        this._pageNumber++;

        if (this.submissions.length < this._total) {
            this.isLoading = true;
            this._loadPendingSubmissions();
        }
    }

    displayDate(timestamp: number, format: string = 'ddd, MMM D YYYY') {
        return moment.unix(timestamp).format(format);
    }

    approveSelected(): void {
        if (this.selectedSubmissionIds.length === 0) {
            this._alertService.clear();
            this._alertService.error('Please select at least one submission');
        } else {
            this.isApproveRejectLoading = true;

            this._userService.updateSubmissionStatus(this.selectedSubmissionIds, 'approve').subscribe((sid: number[]) => {
                for (let id of sid) {
                    let idx = 0;
                    for (let submission of this.submissions) {
                        if (submission.id === id) {
                            this.submissions.splice(idx, 1);
                            break;
                        }
                        idx++;
                    }
                }
                this.selectedSubmissionIds = [];
                this.isApproveRejectLoading = false;
            });
        }
    }

    rejectSelected(): void {
        if (this.selectedSubmissionIds.length === 0) {
            this._alertService.clear();
            this._alertService.error('Please select at least one submission');
        } else {
            this.isApproveRejectLoading = true;

            this._userService.updateSubmissionStatus(this.selectedSubmissionIds, 'reject').subscribe((sid) => {
                for (let id of sid) {
                    let idx = 0;
                    for (let submission of this.submissions) {
                        if (submission.id === id) {
                            this.submissions.splice(idx, 1);
                            break;
                        }
                        idx++;
                    }
                }
                this.selectedSubmissionIds = [];
                this.isApproveRejectLoading = false;
            });
        }
    }

    selectSubmission(id: number): void {
        if (id === 0) { // select all
            if (this.selectedSubmissionIds.length === this.submissions.length) {
                this.selectedSubmissionIds = [];
            } else {
                this.selectedSubmissionIds = [];
                for (let submission of this.submissions) {
                    this.selectedSubmissionIds.push(submission.id);
                }
            }
        } else {
            let index = this.selectedSubmissionIds.indexOf(id);
            if (index > -1) {
                this.selectedSubmissionIds.splice(index, 1);
            } else {
                this.selectedSubmissionIds.push(id);
            }
        }
    }
}