import { Injectable, Output, EventEmitter } from '@angular/core';
import { SettingService } from './setting.service';
import { Category } from 'app/models/category.model';

declare let moment: any;

@Injectable()
export class CategoryControlsService {
    public arrCategoryState = [];
    public arrLatestArticleCreatedOfCategories = [];

    @Output() change: EventEmitter<boolean[]> = new EventEmitter();

    constructor(private _settingService: SettingService) {
    }

    initData(categories: Category[]): void {
        for (const idx in categories) {
            const cat = categories[idx];
            this.arrCategoryState[cat.id] = false;

            this.arrLatestArticleCreatedOfCategories[cat.id] = cat.latestArticleCreated;
        }            
    }

    openAll(): void {
        console.log('open all');
        for (const idx in this.arrCategoryState) {
            this.arrCategoryState[idx] = true;
        }

        this.change.emit(this.arrCategoryState);
    }

    closeAll(): void {
        console.log('close all');
        for (const idx in this.arrCategoryState) {
            this.arrCategoryState[idx] = false;
        }

        this.change.emit(this.arrCategoryState);
    }

    openUpdated(): void {
        console.log('open updated');
        for (const idx in this.arrCategoryState) {
            this.arrCategoryState[idx] = false;
        }

        let currentTimestamp = moment().unix();
        let openCategoryWithInSecs = Number(this._settingService.configurations.open_category_within) * 3600;
        this.arrLatestArticleCreatedOfCategories.forEach((latestArticleCreated, idx) => {
            if (currentTimestamp - latestArticleCreated < openCategoryWithInSecs) {
                this.arrCategoryState[idx] = true;
            }
        });

        this.change.emit(this.arrCategoryState);
    }

    hasOpenedCategory(): boolean {
        for (const idx in this.arrCategoryState) {
            if (this.arrCategoryState[idx]) {
                return true;
            }
        }

        return false;
    }

    setOpenCategory(idx) {
        this.arrCategoryState[idx] = true;
        this.change.emit(this.arrCategoryState);
    }
}