import {Component} from '@angular/core';

import * as CurrentPageActions from '../../reducers/current-page/current-page.actions';
import * as TopMenuActions from '../../reducers/top-menu/top-menu.actions';
import {MetaService} from '../../services/meta.service';
import {AppState} from '../../reducers/app-state-reducer';
import {Store} from '@ngrx/store';

@Component({
  selector: 'not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss']
})

export class NotFoundPageComponent {
  constructor(private _metaService: MetaService, private _store: Store<AppState>) {
    this._store.dispatch(new TopMenuActions.SetTopMenuStyle('normal'));
    this._store.dispatch(new CurrentPageActions.SetCurrentPage('not-found'));

    this._metaService.setTitle('Page Not Found');
  }
}
