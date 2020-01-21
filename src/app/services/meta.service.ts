import {Injectable} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {SettingService} from './setting.service';
import {Router} from '@angular/router';

@Injectable()
export class MetaService {
    constructor(private title: Title, private meta: Meta, private settingService: SettingService,
            private router: Router) {
        this.router.events.subscribe(event => {
            this.setDefaultMeta();
        });
    }

    private setDefaultMeta(): void {
        this.title.setTitle('Viidium');
        this.meta.updateTag({property: 'og:image', content: this.settingService.getLogoUrl()});
        this.meta.updateTag({name: 'description', content: 'Vietnamese digital media platform.'});
    }

    getTitle(): string {
        return this.title.getTitle();
    }

    setTitle(newTitle: string): void {
        this.title.setTitle(newTitle + ' | Viidium');
    }

    setTag(name: string, content: string): void {
        content = content ? content : '';
        if (name.indexOf('og') === 0) {
            this.meta.updateTag({property: name, content: content});
        } else {
            this.meta.updateTag({name: name, content: content});
        }
    }
}
