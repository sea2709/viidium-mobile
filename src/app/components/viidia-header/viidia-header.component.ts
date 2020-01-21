import {Component, ElementRef, HostListener, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {DOCUMENT, Location} from '@angular/common';
import {Store} from '@ngrx/store';
import {AppState} from '../../reducers/app-state-reducer';
import {Observable} from 'rxjs/Observable';
import {Article} from '../../models/article.model';
import {ArticleService} from '../../services/article.service';
import {User} from '../../models/user.model';
import {UserService} from '../../services/user.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import { HeaderService } from '../../services/header.service';

import 'rxjs/add/operator/map';
import { CategoryControlsService } from 'app/services/category.controls.service';
import { StringUtilities } from 'app/utilities/string';
import { ArrUtilities } from 'app/utilities/arr';

declare let jQuery: any;

@Component({
    selector: 'viidia-header',
    templateUrl: 'viidia-header.component.html',
    styleUrls: ['./viidia-header.component.scss']
})

export class ViidiaHeaderComponent implements OnInit {
    searchActive = false;
    canvasActive = false;
    isLoading = false;
    featuredArticles: Article[] = [];

    loginRef: BsModalRef;
    loginForm: FormGroup;
    subscribeForm: FormGroup;
    user: User;
    loginErrorText: string;
    subscribeReseponseText = '';
    subscribeSuccessfully = false;

    topMenuStyle$: Observable<string>;
    currentPage$: Observable<string>;
    loggedInUser$: Observable<User>;

    private _lastTop: number;
    private _shrinkClass: string;

    @ViewChild('searchTextField')
    private _searchTextField: ElementRef;

    @ViewChild('menu')
    private _menuEle: ElementRef;

    @ViewChild('articlesCarousel')
    private _articlesCarousel: ElementRef;

    constructor(private _route: ActivatedRoute, private _router: Router, private _location: Location,
        private _store: Store<AppState>, @Inject(DOCUMENT) private document: Document,
        private _articleService: ArticleService, private _userService: UserService,
        private _authService: AuthService, private _modalService: BsModalService, private _headerService: HeaderService,
        public categoryControlsService: CategoryControlsService, public stringUtilities: StringUtilities,
        private _arrUtilities: ArrUtilities) {

        this.topMenuStyle$ = this._store.select(state => state.topMenuStyle);
        this.currentPage$ = this._store.select(state => state.currentPage);
        this.loggedInUser$ = this._store.select(state => state.loggedInUser);
    }

    ngOnInit(): void {
        this.loggedInUser$.subscribe({
            next: user => this.user = user
        });

        this.loginForm = new FormGroup({
            'username': new FormControl(null, [Validators.required]),
            'password': new FormControl(null, [Validators.required])
        });

        this.subscribeForm = new FormGroup({
            'email': new FormControl(null, [Validators.required, Validators.email])
        });

        this._lastTop = this.document.body.scrollTop;
        this._router.events.filter(event => event instanceof NavigationEnd)
            .map(() => this._route)
            .map(route => {
                this.closeCanvas();
                this.searchActive = false;
                
                if (this.loginRef) {
                    this.loginRef.hide();
                }
            }).subscribe();

        this.currentPage$.subscribe({
            next: currentPage => {
                if (this._shrinkClass) {
                    jQuery('.vi-header').removeClass(this._shrinkClass);
                }

                if (currentPage && currentPage === 'home') {
                    this._shrinkClass = 'vi-shrink-home';

                    this._articleService.getFeaturedArticles().subscribe({
                        next: articles => {
                            this.featuredArticles = this._arrUtilities.shuffle(articles);
                            if (this.featuredArticles.length > 0) {
                                setTimeout(() => {
                                    jQuery(this._articlesCarousel.nativeElement).slick({
                                        slidesToShow: 3
                                    });
                                });
                            }
                        }
                    })
                } else {
                    this._shrinkClass = 'vi-shrink';
                }
            }
        });

        document.addEventListener('click', (e) => {
            let headerElement = document.querySelector('.vi-header');
            let bottomBarElement = document.querySelector('.vi-menu-bottom-bar');
            if (!headerElement.contains(e.srcElement) 
                && (bottomBarElement == null || !bottomBarElement.contains(e.srcElement))
                && this._headerService.isShowed) {
                this.toggleSearch();
            }
        });

        this._router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            
            setTimeout(() => {
                if (this._menuEle) {
                    const menuEle = jQuery(this._menuEle.nativeElement);
                    let menuActive = menuEle.find('.vi-active');
                    if (menuActive.length > 0) {
                        const left = jQuery(menuActive[0]).offset().left + menuEle.scrollLeft() - 10;
                        
                        jQuery(this._menuEle.nativeElement).scrollLeft(left);
                    }
                }
            });
        });

        this._headerService.change.subscribe((isShowed) => {
            setTimeout(() => {
                this.searchActive = isShowed;
                if (this.searchActive) {
                    setTimeout(() => {
                        this._searchTextField.nativeElement.focus();
                    });
                }
            });
        });

        setTimeout(() => {
            jQuery('.scroll').click(function(){
                jQuery('html, body').animate({
                    scrollTop: 0
                });
                return false;
            });
        });

        this._articleService.updateFeaturedArticles$.subscribe(articles => {
            jQuery(this._articlesCarousel.nativeElement).slick('unslick');
            this.featuredArticles = articles;
            setTimeout(() => {
                jQuery(this._articlesCarousel.nativeElement).slick({
                    slidesToShow: 3
                });
            });
        });
    }

    toggleSearch(): void {
        this._headerService.toggleSearch();
    }

    showCanvasMenu(): void {
        this.canvasActive = true;
    }

    closeCanvas(): void {
        this.canvasActive = false;
    }

    search(): void {
        this._router.navigate(['/search'], {queryParams: {q: this._searchTextField.nativeElement.value}});
    }

    goBack(): void {
        this._location.back();
    }

    showLoginForm(loginForm: TemplateRef<any>): void {
        this.loginRef = this._modalService.show(loginForm);
    }

    onLoginSubmit(): void {
        this.loginErrorText = null;
        this.isLoading = true;

        this._authService.login(this.loginForm.get('username').value, this.loginForm.get('password').value).subscribe(
            () => {
                this._userService.getLoggedInUser().subscribe({
                    next: user => {
                       this.user = user;
                       this.loginRef.hide();
                       this.isLoading = false;
                       this._router.navigate(['/profile', this.user.username]);
                    },
                    error: errors => {
                        this.isLoading = false;
                        this.loginErrorText = 'Login unsuccessfully !';
                    }
                });
            },
            () => {
                this.loginErrorText = 'Login unsuccessfully !';
                this.isLoading = false;
            }
        );
    }

    onSubscribeSubmit(): void {
        this.isLoading = true;
        this.subscribeReseponseText = '';
        this.subscribeSuccessfully = false;
        this._userService.subscribe(this.subscribeForm.get('email').value).subscribe((response) => {
            if (response.sid) {
                this.subscribeReseponseText = 'Thank you for your subscription!';
                this.subscribeSuccessfully = true;
            } else {
                if (response.error && response.error.email) {
                    this.subscribeReseponseText = response.error.email;
                }
            }

            this.isLoading = false;
        })
    }

    logout(): void {
        this._userService.logout();
        this.closeCanvas();
        this._router.navigate(['/']);
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        let top = jQuery(document).scrollTop();

        if (this._shrinkClass) {
            if (this._lastTop > top || this._lastTop < 0) {
                jQuery('.vi-header').removeClass(this._shrinkClass);
                jQuery('.vi-app-wrapper').removeClass('scroll-home');
            } else {
                jQuery('.vi-header').addClass(this._shrinkClass);
                jQuery('.vi-app-wrapper').addClass('scroll-home');
            }

            if (top > 0) {
                jQuery('.vi-header').addClass('vi-colorize');
            } else {
                jQuery('.vi-header').removeClass('vi-colorize');
            }

            this._lastTop = top;
        }

        if (top > 100 ) {
            jQuery('.vi-scroll-top:hidden').stop(true, true).fadeIn();
        } else {
            jQuery('.vi-scroll-top').stop(true, true).fadeOut();
        }
    }
}
