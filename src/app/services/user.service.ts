import {SettingService} from './setting.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {User} from '../models/user.model';
import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {Store} from '@ngrx/store';
import {AppState} from '../reducers/app-state-reducer';

import * as LoggedInUserActions from '../reducers/logged-in-user/logged-in-user.actions';

@Injectable()
export class UserService {
    private _loggedInUser: User = null;

    constructor(private _http: HttpClient, private _settingService: SettingService, private _authService: AuthService,
                private _store: Store<AppState>) {
    }

    createUserFromJsonResponse(userJson: any): User {
        const userData = {
            id: userJson.uid[0].value,
            username: userJson.name[0].value,
            name: userJson.field_name[0] ? userJson.field_name[0].value : userJson.name[0].value,
            email: userJson.mail ? userJson.mail[0].value : null,
            description: userJson.field_description[0] ? userJson.field_description[0].value : null,
            image: userJson.user_picture[0] ? userJson.user_picture[0].url : null,
            userPictureId: userJson.user_picture[0] ? userJson.user_picture[0].target_id : null,
            coverPhoto: userJson.field_cover_photo[0] ? userJson.field_cover_photo[0].url : '',
            coverPhotoId: userJson.field_cover_photo[0] ? userJson.field_cover_photo[0].target_id : null,
            topics: []
        };
        for (let topic of userJson.field_topics) {
            userData.topics.push(topic.target_id);
        }

        return new User(userData);
    }

    getLoggedInUser(): Observable<User> {
        if (this._authService.isLoggedIn()) {
            return Observable.create(observer => {
                if (this._loggedInUser === null) {
                    let params = new HttpParams();
                    params = params.set('_format', 'json');
                    this._http.get(this._settingService.getApiUrl() + '/user/' + this._authService.getUid(), {params: params}).subscribe({
                        next: (response: any) => {
                            const userData = {
                                id: response.uid[0].value,
                                username: response.name[0].value,
                                name: response.field_name[0] ? response.field_name[0].value : response.name[0].value,
                                email: response.mail[0].value,
                                description: response.field_description[0] ? response.field_description[0].value : '',
                                image: response.user_picture[0] ? response.user_picture[0].url : '',
                                userPictureId: response.user_picture[0] ? response.user_picture[0].target_id : null,
                                coverPhoto: response.field_cover_photo[0] ? response.field_cover_photo[0].url : '',
                                coverPhotoId: response.field_cover_photo[0] ? response.field_cover_photo[0].target_id : null,
                                topics: [],
                                roles: []
                            };
                            for (let topic of response.field_topics) {
                                userData.topics.push(topic.target_id);
                            }
                            this._loggedInUser = new User(userData);
                            if (response.roles) {
                                const roles = [];
                                for (let role of response.roles) {
                                    roles.push(role.target_id);
                                }
                                this._loggedInUser.roles = roles;
                                this._store.dispatch(new LoggedInUserActions.SetLoggedInUser(this._loggedInUser));
                                observer.next(this._loggedInUser);
                                observer.complete();
                            } else {
                                this._http.get(this._settingService.getApiUrl() + '/viidia_user/roles/' + this._authService.getUid(), {params: params}).subscribe({
                                    next: (roles: string[]) => {
                                        this._loggedInUser.roles = roles;
                                        this._store.dispatch(new LoggedInUserActions.SetLoggedInUser(this._loggedInUser));
                                        observer.next(this._loggedInUser);
                                        observer.complete();
                                    }
                                });
                            }
                        }
                    });
                } else {
                    observer.next(this._loggedInUser);
                    observer.complete();
                }
            });
        } else {
            this.logout();
            return Observable.create(observer => {
                observer.next(this._loggedInUser);
                observer.complete();
            });
        }
    }

    getUser(username: string): Observable<User> {
        let params = new HttpParams();
        params = params.set('_format', 'json');
        return this._http.get(this._settingService.getApiUrl() + '/viidia_user/' + username, {params: params}).map(
            (response: { user: any, roles: string[] }) => {
                const responseUser = this.createUserFromJsonResponse(response.user);
                responseUser.roles = response.roles;

                return responseUser;
            }
        );
    }

    register(name, email, username, password, description, topics, regCode): Observable<User> {
        const topicsValue = [];
        for (let topicId of topics) {
            topicsValue.push({'target_id': topicId});
        }
        return this._http.post(this._settingService.getApiUrl() + '/viidia_user/register/?_format=json&reg_code=' + regCode,
            {
                'name': {'value': username},
                'mail': {'value': email},
                'pass': {'value': password},
                'field_name': {'value': name},
                'field_description': {'value': description},
                'field_topics': topicsValue
            }
        ).map((response: {
                   field_description: any,
                   field_name: any,
                   name: any,
                   email: any,
                   uid: any,
                   mail: any,
                   field_topics: any,
                   roles: any
               }) => {
                return this.createUserFromJsonResponse(response);
            }
        );
    }

    logout(): void {
        this._loggedInUser = null;
        this._authService.logout();
        this._store.dispatch(new LoggedInUserActions.SetLoggedInUser(null));
    }

    load(): Promise<User> {
        let observable = this.getLoggedInUser();
        return observable.toPromise();
    }

    submitArticles(link: string, categoryId: number, collectionIds: number[], tags: string, saySomething: string) {
        const submitData = {};
        submitData['webform_id'] = 'contribute_article';
        submitData['category'] = categoryId;
        submitData['say_something'] = saySomething;
        submitData['article_link'] = link;
        submitData['collections'] = collectionIds;
        submitData['tags'] = tags;
        submitData['is_waiting_for_user'] = 0;
        submitData['sticky'] = 1;
        submitData['in_draft'] = 1;

        return this._http.post(this._settingService.getApiUrl() + '/webform_rest/submit?_format=json', submitData);
    }

    editArticle(id: number, link: string, categoryId: number, saySomething: string) {
        const submitData = {};
        submitData['submission_ids'] = [id];
        submitData['category'] = categoryId;
        submitData['say_something'] = saySomething;
        submitData['article_link'] = link;
        submitData['is_waiting_for_user'] = 0;

        return this._http.post(this._settingService.getApiUrl() + '/viidia_article/webform_update_submission?_format=json', submitData);
    }

    uploadProfilePhoto(data: string, fileName: string) {
        const submitData = {
            'filename': fileName,
            'data': data
        };

        return this._http.post(this._settingService.getApiUrl() + '/file_rest/submit/?_format=json', submitData);
    }

    updateUser(user: User, currentPassword: string = ''): Observable<User> {
        const topics = [];
        for (let topic of user.topics) {
            topics.push({'target_id': topic});
        }
        const data = {
            'mail': {'value': user.email},
            'field_name': {'value': user.name},
            'field_description': {'value': user.description},
            'field_cover_photo': [{'target_id': user.coverPhotoId}],
            'user_picture': [{'target_id': user.userPictureId}],
            'field_topics': topics
        };

        if (currentPassword !== '') {
            data['pass'] = [{'existing': currentPassword}];
        }

        return this._http.patch(this._settingService.getApiUrl() + '/user/' + user.id + '/?_format=json', data).map(
            (response: {
                   user_picture: any,
                   field_cover_photo: any,
                   field_description: any,
                   field_name: any,
                   name: any,
                   email: any,
                   uid: any,
                   mail: any,
                   field_topics: any
               }) => {
                return this.createUserFromJsonResponse(response);
            }
        );
    }

    getInterestingTopics(): Observable<any> {
        return this._http.get(this._settingService.getApiUrl() + '/taxonomy_term_rest/topic/list/?_format=json')
            .map((response: [{ tid: any, name: any }]) => {
                let topics = [];
                for (let resTopic of response) {
                    topics.push({
                        id: resTopic.tid[0].value,
                        name: resTopic.name[0].value
                    });
                }

                return topics;
            });
    }

    invite(name: string, email: string, message: string) {
        return this._http.post(
            this._settingService.getApiUrl() + '/invite_by_email/submit/?_format=json',
            {'name': name, 'email': email, 'message': message, 'type': 'viidium'}
        );
    }

    submitContact(name: string, email: string, subject: string, message: string) {
        const submitData = {};
        submitData['webform_id'] = 'contact';
        submitData['name'] = name;
        submitData['email'] = email;
        submitData['subject'] = subject;
        submitData['message'] = message;

        return this._http.post(this._settingService.getApiUrl() + '/webform_rest/submit?_format=json', submitData);
    }

    acceptInvitation(regCode: string) {
        return this._http.get(this._settingService.getApiUrl()
            + '/invite_by_email/accept_invitation/' + regCode + '/?_format=json');
    }

    getSubmittedArticles(userId: number): Observable<any> {
        return this._http.get(this._settingService.getApiUrl() + '/viidia_article/webform_submissions/'
            + this._settingService.getSubmitArticlesFormId() + '/' + userId + '/?_format=json').map(
            (response) => {
                const pendingSubmissions = [];
                const approvedSubmissions = [];
                const waitingForUserSubmissions = [];

                for (let idx of Object.keys(response)) {
                    const responseObj = response[idx];
                    switch (responseObj.status) {
                        case 1: {
                            approvedSubmissions.push(responseObj);
                            break;
                        }
                        case 0: {
                            pendingSubmissions.push(responseObj);
                            break;
                        }
                        case 2: {
                            waitingForUserSubmissions.push(responseObj);
                            break;
                        }
                    }
                }

                return {
                    pendingSubmissions: pendingSubmissions,
                    approvedSubmissions: approvedSubmissions,
                    waitingForUserSubmissions: waitingForUserSubmissions
                }
            }
        );
    }

    getAwaitingSubmittedArticles(pageNumber: number, submissionsPerPage: number = 20): Observable<any> {
        let params = new HttpParams();
        params = params.set('_format', 'json')
            .set('page', pageNumber.toString())
            .set('submissionsPerPage', submissionsPerPage.toString());

        return this._http.get(this._settingService.getApiUrl() + '/viidia_article/webform_awaiting_submissions/'
            + this._settingService.getSubmitArticlesFormId(), {params: params}).map(
            (response: { data: any, total: number }) => {
                let objs = [];
                for (let obj of response.data) {
                    if (obj.user) {
                        obj.user = this.createUserFromJsonResponse(obj.user);
                        objs.push(obj);
                    }
                }

                return {
                    total: response.total,
                    submissions: objs
                };
            }
        );
    }

    updateSubmissionStatus(sId: number[] = [], status: string, note: string = null): Observable<any> {
        return this._http.post(this._settingService.getApiUrl() + '/viidia_article/webform_update_submission?_format=json',
            {
                'submission_ids': sId,
                'status': status,
                'note': note
            }
        ).map((response: { sid: number[] }) => {
            return response.sid;
        });
    }

    updatePassword(id: number, oldPass: string, newPass: string) {
        const data = {
            'pass': [{'existing': oldPass, 'value': newPass}]
        };

        // return this._http.patch(this._settingService.getApiUrl() + 'user/' + id + '?_format=json', data);
        return this._http.post(this._settingService.getApiUrl() + '/viidia_user/update/password/?_format=json', data);
    }

    updatePassword2(userId: number, timestamp: number, hash: string, newPass: string) {
        const data = {
            'user_id': userId,
            'timestamp': timestamp,
            'hash': hash,
            'password': newPass
        };

        return this._http.post(this._settingService.getApiUrl() + '/viidia_user/update/reset-password/?_format=json', data);
    }

    forgotPassword(username: string) {
        return this._http.post(this._settingService.getApiUrl() + '/viidia_user/forgot-pasword/?_format=json',
            {username: username});
    }

    subscribe(email: string): Observable<any> {
        const submitData = {};
        submitData['webform_id'] = 'subscription';
        submitData['email'] = email;

        return this._http.post(this._settingService.getApiUrl() + '/webform_rest/submit?_format=json', submitData);
    }
}
