import { Collection } from "./collection.model";
import { Group } from "./group.model";

export class User {
    public id: number;
    public username: string;
    public name: string;
    public email: string;
    public description: string;
    public image: string;
    public userPictureId: number;
    public coverPhoto: string;
    public coverPhotoId: number;
    public topics: number[];
    public roles: string[];

    constructor(jsonObject) {
        this.id = jsonObject.id;
        this.username = jsonObject.username;
        this.name = jsonObject.name;
        this.email = jsonObject.email;
        this.description = jsonObject.description;
        this.image = jsonObject.image;
        this.userPictureId = jsonObject.userPictureId;
        this.coverPhoto = jsonObject.coverPhoto;
        this.coverPhotoId = jsonObject.coverPhotoId;
        this.topics = jsonObject.topics;
        this.roles = jsonObject.roles;
    }

    public isEditor(): boolean {
        let count = 0;
        if (this.roles.indexOf('curator') > -1) {
            count++;
        }
        if (this.roles.indexOf('publisher') > -1) {
            count++;
        }
        if (this.roles.indexOf('contributor') > -1) {
            count++;
        }
        if (this.roles.indexOf('editorial_board') > -1) {
            count++;
        }

        return count > 0;
    }

    public canAddToOurPicks(): boolean {
        return (this.roles.indexOf('administrator') > -1) || (this.roles.indexOf('editorial_board') > -1);
    }

    public canAddToCollections(): boolean {
        return this.isEditor() || (this.roles.indexOf('administrator') > -1);
    }

    public canRemoveArticleFromCollection(collection: Collection): boolean {
        if (this.roles.indexOf('administrator') > -1) {
            return true;
        }

        if (this.id == collection.userId) {
            return true;
        }

        if (this.isEditor() && !collection.isPrivate) {
            return true;
        }

        return false;
    }

    public canDeleteCollection(collection: Collection): boolean {
        if (this.roles.indexOf('administrator') > -1) {
            return true;
        }

        if (this.id == collection.userId) {
            return true;
        }

        return false;
    }

    public canRemoveArticleFromGroup(group: Group): boolean {
        return this.roles.indexOf('administrator') > -1;
    }

    public canRepostArticle(): boolean {
        return this.roles.indexOf('administrator') > -1;
    }

    public canFeaturedArticle(): boolean {
        return this.roles.indexOf('administrator') > -1;
    }
}