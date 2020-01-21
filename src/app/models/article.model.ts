import {Category} from './category.model';
import {SafeHtml} from '@angular/platform-browser';
import {Source} from './source.model';
import {Group} from './group.model';

import * as moment from 'moment';
import {User} from './user.model';
import { Tag } from './tag.model';

export class Article {
    public id: number;
    public name: string;
    public body: string;
    public summary: string;
    public processed: string;
    public image: string;
    public teaserImage: string;
    public category: Category;
    public sourceUrl: string;
    public videoHtml: SafeHtml;
    public createdDate: Date;
    public externalReferral = false;
    public articleSource: Source;
    public curatedBy: User;
    public curatedByUserId: number;
    public publishedBy: User;
    public publishedByUserId: number;
    public contributedBy: User;
    public contributedByUserId: number;
    public featured = false;
    public tags: Tag[] = [];

    constructor(jsonObject) {
        this.id = jsonObject.id;
        this.name = jsonObject.name;
        this.body = jsonObject.body;
        this.summary = jsonObject.summary;
        this.processed = jsonObject.processed;
        this.image = jsonObject.image;
        if (jsonObject.teaserImage) {
            this.teaserImage = jsonObject.teaserImage;
        } else {
            this.teaserImage = this.image;
        }
        this.category = jsonObject.category;
        this.sourceUrl = jsonObject.sourceUrl;

        if (jsonObject.videoHtml) {
            this.videoHtml = jsonObject.videoHtml;
        }

        if (jsonObject.createdDate) {
            if (jsonObject.createdDate instanceof Date) {
                this.createdDate = jsonObject.createdDate;
            } else {
                this.createdDate = moment(jsonObject.createdDate, moment.ISO_8601).toDate();
            }
        }

        if (jsonObject.externalReferral) {
            this.externalReferral = jsonObject.externalReferral;
        }

        if (jsonObject.articleSource) {
            this.articleSource = jsonObject.articleSource;
        }

        if (jsonObject.curatedByUserId) {
            this.curatedByUserId = jsonObject.curatedByUserId;
        }
        if (jsonObject.curatedBy) {
            this.curatedBy = jsonObject.curatedBy;
            this.curatedByUserId = jsonObject.curatedBy.id;
        }

        if (jsonObject.publishedByUserId) {
            this.publishedByUserId = jsonObject.publishedByUserId;
        }
        if (jsonObject.publishedBy) {
            this.publishedBy = jsonObject.publishedBy;
            this.publishedByUserId = this.publishedBy.id;
        }

        if (jsonObject.contributedByUserId) {
            this.contributedByUserId = jsonObject.contributedByUserId;
        }
        if (jsonObject.contributedBy) {
            this.contributedBy = jsonObject.contributedBy;
            this.contributedByUserId = this.contributedBy.id;
        }

        if (jsonObject.featured) {
            this.featured = jsonObject.featured;
        }

        if (jsonObject.tags) {
            this.tags = jsonObject.tags;
        }
    }

    needToRediect(): boolean {
        if (this.externalReferral) {
            return this.articleSource.redirect;
        }

        return false;
    }

    getImage(): string {
        if (this.image) {
            return this.image;
        }

        if (this.teaserImage) {
            return this.teaserImage;
        }
    }

    canAddToGroup(group: Group): boolean {
        let canAdd = true;

        if (group && group.articles) {
            for (const article of group.articles) {
                if (article.id == this.id) {
                    canAdd = false;
                    break;
                }
            }
        }

        return canAdd;
    }

    canRemoveFromGroup(group: Group): boolean {
        if (group && group.articles) {
            return group.articles.findIndex(a => a.id == this.id) > -1;
        }

        return false;
    }
 }