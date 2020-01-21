import {Input, Component, ViewChild, ElementRef} from '@angular/core';
import { Article } from 'app/models/article.model';
import { Group } from 'app/models/group.model';
import { User } from 'app/models/user.model';
import { UserService } from 'app/services/user.service';
import { SettingService } from 'app/services/setting.service';
import { GroupService } from 'app/services/group.service';
import { AlertService } from 'app/services/alert.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ArticleService } from 'app/services/article.service';
import { Collection } from 'app/models/collection.model';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { CollectionService } from 'app/services/collection.service';

declare let jQuery: any;

@Component({
  selector: 'article-actions',
  templateUrl: 'article-actions.component.html',
  styleUrls: ['./article-actions.component.scss']
})

export class ArticleActionsComponent  {
  @Input()
  article: Article;

  @Input()
  direction = 'right';

  public loggedInUser: User;
  public todayGroup: Group;
  public collections: Collection[] = [];
  public collectionsForm: FormGroup;
  public isAssigningCollections = false;

  @ViewChild('alertModal')
  alertModal: ElementRef;

  @ViewChild('collectionsModal')
  collectionsModal: ElementRef;

  public alertModalRef: BsModalRef;
  public collectionsModalRef: BsModalRef;

  constructor(private _userService: UserService, private _settingService: SettingService, 
    private _groupService: GroupService, private _alertService: AlertService, 
    private _modalService: BsModalService, private _articleService: ArticleService, 
    private _collectionService: CollectionService) {
  }
  
  ngOnInit(): void {
    this._userService.getLoggedInUser().subscribe((user) => this.loggedInUser = user);

    if (this._settingService.configurations['group_special_in_day']) {
      this._groupService.getGroupById(this._settingService.configurations['group_special_in_day']).subscribe({
          next: response => {
            this.todayGroup = response;
          }
      });
    }

    this.collectionsForm = new FormGroup({
      'collections': new FormArray([])
    });
  }  

  onRemoveFromOurPicks(): void {
    if (this.todayGroup) {
      this._groupService.removeArticleFromGroup(this.todayGroup.id, this.article).subscribe({
          next: (group: Group) => {
              if (group.articles.length != this.todayGroup.articles.length) {
                  this._alertService.success('Remove article from our picks successfully !');
                  this.todayGroup = group;
              } else {
                  this._alertService.error('Remove article from our picks unsuccessfully !');
              }

              this.alertModalRef = this._modalService.show(this.alertModal);
          }
      });
    }
  }

  onAddToOurPicks(): void {
    if (this.todayGroup) {
      this._groupService.addArticleToGroup(this.todayGroup.id, this.article).subscribe({
          next: (group: Group) => {
              if (group.articles.length != this.todayGroup.articles.length) {
                  this._alertService.success('Add article to our picks successfully !');
                  this.todayGroup = group;
              } else {
                  this._alertService.error('Add article to our picks unsuccessfully !');
              }

              this.alertModalRef = this._modalService.show(this.alertModal);
          }
      });
    }
  }

  onAddToCollections(): void {
    if (this.collections.length == 0) {
      this._collectionService.getCollections('title', 'ASC').subscribe({
        next: collections => {
            collections.forEach(collection => {
                if (!collection.containArticle(this.article)) {
                    this.collections.push(collection);
                    const control = new FormControl();
                    (<FormArray>this.collectionsForm.get('collections')).push(control);
                }
            });
        }
      });
    }
    
    this.collectionsModalRef = this._modalService.show(this.collectionsModal);
  }

  onRepost(): void {
    this._articleService.repostArticle(this.article).subscribe({
      next: response => {
          if (response.success) {
              this._alertService.success(response.msg);
              this.alertModalRef = this._modalService.show(this.alertModal);
          } 
      }
    });
  }

  onToggleFeatured(): void {
    if (this.article.featured) {
      this._groupService.removeArticleFromGroup(this._settingService.configurations['featured_group'], this.article).subscribe({
        next: (group: Group) => {
          if (group.id && group.articles.findIndex(a => a.id == this.article.id) === -1) {
              this._alertService.success('Un-featured article successfully !');
              this.alertModalRef = this._modalService.show(this.alertModal);

              this.article.featured = !this.article.featured;
          } 
        }
      });
    } else {
      this._groupService.addArticleToGroup(this._settingService.configurations['featured_group'], this.article).subscribe({
          next: (group: Group) => {
            if (group.id && group.articles[0].id == this.article.id) {
              this._alertService.success('Mark article as featured successfully !');
              this.alertModalRef = this._modalService.show(this.alertModal);

              this.article.featured = !this.article.featured;
            } 
          }
      });
    }
  }

  canAddToOurPicks(): boolean {
    return this.loggedInUser && this.loggedInUser.canAddToOurPicks() && this.article.canAddToGroup(this.todayGroup);
  }

  canRemoveFromOurPicks(): boolean {
    return this.loggedInUser && this.loggedInUser.canAddToOurPicks() && this.article.canRemoveFromGroup(this.todayGroup);
  }

  canAddToCollections(): boolean {
    return this.loggedInUser && this.loggedInUser.canAddToCollections();
  }

  canRepost(): boolean {
    return this.loggedInUser && this.loggedInUser.canRepostArticle();
  }

  canFeatured(): boolean {
    return this.loggedInUser && this.loggedInUser.canFeaturedArticle();
  }

  getControls(frmGrp: FormGroup, key: string) {
    return (<FormArray>frmGrp.controls[key]).controls;
  }

  onCollectionsSubmit(): void {
      this._alertService.clear();
      if (this.collectionsForm.valid && this.collectionsForm.touched) {
          const selectedCollections = this.collectionsForm.get('collections').value;
          const selectedCollectionIds = [];
          const me = this;
          const arrIdx = [];
          selectedCollections.forEach((selected, index) => {
              if (selected) {
                  selectedCollectionIds.push(me.collections[index].id);
                  arrIdx.push(index);
              }
          });

          this.isAssigningCollections = true;
          this._collectionService.assignArticleToCollections(this.article.id, selectedCollectionIds).subscribe({
              next: response => {
                  this.isAssigningCollections = false;
                  if (response.success) {
                      this._alertService.success(response.msg);
                      arrIdx.reverse().forEach(idx => {
                          (<FormArray>this.collectionsForm.controls['collections']).removeAt(idx);
                          this.collections.splice(idx, 1);
                      });

                      jQuery('modal-container').animate({
                          scrollTop: 0
                      })
                  } else {
                      this._alertService.error(response.msg);
                  }
              }
          });
      }
  }

  onCloseCollections(): void {
      this.collectionsModalRef.hide();
      this.collectionsForm.reset();
      this._alertService.clear();
  }
}