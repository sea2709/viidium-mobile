import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {User} from '../../../../models/user.model';
import {UserService} from '../../../../services/user.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Category} from '../../../../models/category.model';
import {ArticleService} from '../../../../services/article.service';
import {AlertService} from '../../../../services/alert.service';

@Component({
    selector: 'pending',
    templateUrl: 'pending.component.html',
    styleUrls: ['./pending.component.scss']
})
export class PendingComponent implements OnInit {
    @Input()
    user: User;

    public pendingSubmissions: any[];
    public approvedSubmissions: any[];
    public waitingForUserSubmissions: any[];

    public activeSubmission: any;
    public modalRef: BsModalRef;
    public editArticleForm: FormGroup;
    public categories: Category[] = [];

    public isLoading = false;

    @ViewChild('userMsgModal')
    private _userMsgModal: TemplateRef<any>;

    @ViewChild('editArticleModal')
    private _editArticleModal: TemplateRef<any>;

    @Output()
    updateArticles: EventEmitter<any> = new EventEmitter();

    constructor(private _userService: UserService, private _modalService: BsModalService,
        private _articleService: ArticleService, private _alertService: AlertService) {
    }

    ngOnInit(): void {
        this.readPosts();

        this._articleService.getArticleCategories().subscribe({
            next: categories => this.categories = categories
        });

        this.editArticleForm = new FormGroup({
            'article_link': new FormControl(null, Validators.required),
            'category': new FormControl(''),
            'say_something': new FormControl()
        });
    }

    readPosts(): void {
        this._userService.getSubmittedArticles(this.user.id).subscribe({
            next: response => {
                this.pendingSubmissions = response.pendingSubmissions;
                this.approvedSubmissions = response.approvedSubmissions;
                this.waitingForUserSubmissions = response.waitingForUserSubmissions;
            }
        });
    }

    note(id: number): void {
        for (let submission of this.waitingForUserSubmissions) {
            if (submission.id === id) {
                this.activeSubmission = submission;
                break;
            }
        }

        this.openModal(this._userMsgModal);
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this._modalService.show(template);
    }

    deleteSubmission(id: number): void {
        this._userService.updateSubmissionStatus([id], 'reject').subscribe(() => {
            this.updateArticles.emit(null);
            this._alertService.clear();
            this._alertService.success('Delete article successfully !!!', true);
            this.modalRef.hide();
        });
    }

    editSubmission(id: number): void {
        this.modalRef.hide();
        this.editArticleForm.setValue({
            'article_link': this.activeSubmission.data.article_link,
            'category': this.activeSubmission.data.category ? this.activeSubmission.data.category : '',
            'say_something': this.activeSubmission.data.say_something
        });
        this.openModal(this._editArticleModal);
    }

    onArticleSubmit(): void {
        if (this.editArticleForm.valid && this.editArticleForm.touched) {
            this.isLoading = true;
            this._alertService.clear();
            this._userService.editArticle(this.activeSubmission.id, this.editArticleForm.get('article_link').value,
                this.editArticleForm.get('category').value, this.editArticleForm.get('say_something').value).subscribe({
                    next: (response: any) => {
                        this.isLoading = false;
                        if (response.sid) {
                            this._alertService.success('Thank you for your update !!!', true);

                            this.updateArticles.emit(null);

                            this.modalRef.hide();
                        } else {
                            if (response.error) {
                                for (const key of Object.keys(response.error)) {
                                    this.editArticleForm.get(key).setErrors({
                                        'custom': [response.error[key]]
                                    });
                                }
                            }
                        }
                    }
                }
            );
        }
    }
}
