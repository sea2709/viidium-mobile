import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {FormControl, FormGroup, Validators, FormArray} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {ArticleService} from '../../services/article.service';
import {AlertService} from '../../services/alert.service';
import {Category} from '../../models/category.model';
import { Collection } from 'app/models/collection.model';
import { CollectionService } from 'app/services/collection.service';

@Component({
    selector: 'submit-article-modal',
    templateUrl: 'submit-article-modal.component.html',
    styleUrls: ['./submit-article-modal.component.scss']
})
export class SubmitArticleModalComponent implements OnInit {
    @ViewChild('submitModal')
    submitModal: ElementRef;

    public submitArticlesForm: FormGroup;
    public modalRef: BsModalRef;
    public isLoading = false;
    public categories: Category[] = [];
    public collections: Collection[] = [];

    @Output() modalClosed: EventEmitter<any> = new EventEmitter();

    constructor(private _modalService: BsModalService, private _userService: UserService,
        private _alertService: AlertService, private _articleService: ArticleService,
        private _collectionService: CollectionService) {}

    ngOnInit() {
        this._articleService.getArticleCategories().subscribe({
            next: categories => this.categories = categories
        });

        this.submitArticlesForm = new FormGroup({
            'article_link': new FormControl(null, Validators.required),
            'category': new FormControl('', Validators.required),
            'say_something': new FormControl(),
            'tags': new FormControl(),
            'collections': new FormArray([])
        });
    }

    getControls(frmGrp: FormGroup, key: string) {
        return (<FormArray>frmGrp.controls[key]).controls;
    }

    showModal() {
        if (this.collections.length == 0) {
            this._collectionService.getCollections('title', 'ASC').subscribe({
                next: collections => {
                    collections.forEach(collection => {
                        this.collections.push(collection);
                        const control = new FormControl();
                        (<FormArray>this.submitArticlesForm.get('collections')).push(control);
                    });
                }
            });
        }

        this.modalRef = this._modalService.show(this.submitModal);
    }

    hideModal() {
        this._alertService.clear();
        this.modalRef.hide();
        this.submitArticlesForm.reset({
            category: ''
        });
        this.modalRef = null;
        this.modalClosed.emit(null);
    }

    onArticleSubmit(): void {
        if (this.submitArticlesForm.valid && this.submitArticlesForm.touched) {
            this.isLoading = true;
            this._alertService.clear();

            const selectedCollections = this.submitArticlesForm.get('collections').value;
            const selectedCollectionIds = [];
            const me = this;
            const arrIdx = [];
            selectedCollections.forEach((selected, index) => {
                if (selected) {
                    selectedCollectionIds.push(me.collections[index].id);
                    arrIdx.push(index);
                }
            });

            this._userService.submitArticles(
                this.submitArticlesForm.get('article_link').value, this.submitArticlesForm.get('category').value,
                    selectedCollectionIds, this.submitArticlesForm.get('tags').value,
                    this.submitArticlesForm.get('say_something').value).subscribe({
                    next: (response: any) => {
                        this.isLoading = false;
                        if (response.sid) {
                            this._alertService.success('Thank you for your submission !!!');
                            this.submitArticlesForm.reset({
                                category: ''
                            });
                        } else {
                            if (response.error) {
                                for (const key of Object.keys(response.error)) {
                                    this.submitArticlesForm.get(key).setErrors({
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