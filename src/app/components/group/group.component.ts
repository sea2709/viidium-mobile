import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {Group} from '../../models/group.model';
import {StringUtilities} from '../../utilities/string';
import {VideoPlayerService} from '../../services/video-player.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Article} from '../../models/article.model';
import {SlugifyPipe} from '../../pipes/slugify.pipe';
import { UserService } from 'app/services/user.service';
import { User } from 'app/models/user.model';

@Component({
    selector: 'group',
    templateUrl: 'group.component.html',
    styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
    @Input()
    randomArticles = true;

    @Input()
    groups: Group[];

    @Input()
    maximumHighlights = 5;

    @Input()
    equalHeight = false;

    @Output() 
    clickArticleDetailsPage: EventEmitter<any> = new EventEmitter;

    @Output() 
    removeArticleFromGroup: EventEmitter<any> = new EventEmitter;

    readMore = 0;
    loggedInUser: User;

    constructor(public stringUtilities: StringUtilities, public videoPlayerService: VideoPlayerService,
        private _route: ActivatedRoute, private _router: Router, private _slugify: SlugifyPipe, private _userService: UserService) {}

    ngOnInit(): void {
        this._userService.getLoggedInUser().subscribe((user) => this.loggedInUser = user);

        this._route.params.subscribe(() => {
            if (this.randomArticles) {
                for (const i in this.groups) {
                    if (!this.groups[i].isRelatedGroup) {
                        if (this.maximumHighlights !== 0 && this.groups[i].articles.length > this.maximumHighlights) {
                            this.readMore = this.groups[i].articles.length - this.maximumHighlights;
                            // this.groups[i].articles = this.groups[i].articles.slice(0, this.maximumHighlights);
                        }

                        const randomNum = Math.floor(Math.random() * this.groups[i].articles.length);

                        const tempArticle = this.groups[i].articles[0];
                        this.groups[i].articles[0] = this.groups[i].articles[randomNum];
                        this.groups[i].articles[randomNum] = tempArticle;
                    }
                }
            }
        });
    }

    gotoArticleDetailsPage(): void {
        this.clickArticleDetailsPage.emit();
    }

    gotoArticleDetails(event: Event, article: Article) {
        if (event.srcElement.className.indexOf('vi-primary-article') > -1 || event.srcElement.className.indexOf('vi-article') > -1) {
            this.gotoArticleDetailsPage();
            this._router.navigate(['/article', article.id, this._slugify.transform(article.name)]);
        }
    }

    onClickRemoveArticleFromGroup(article: Article): void {
        this.removeArticleFromGroup.emit(article);
    }
}
