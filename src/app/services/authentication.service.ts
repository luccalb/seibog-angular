import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  currentUser: User = JSON.parse(localStorage.getItem('currentUser'));

  USER_URL: string = environment.apiUrl + '/users';

  constructor(private http: HttpClient) { }

  login(taNumber: string, password: string) {
    return this.http.post<any>(`${this.USER_URL}/authenticate`, {username: taNumber, password: password})
      .pipe(map(user => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUser = user;
        }
        return user;
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
  }

  updateUser(user: User) {
    this.currentUser = user;
    const tempUser = JSON.parse(localStorage.getItem('currentUser'));
    tempUser.score = user.score;
    localStorage.setItem('currentUser', JSON.stringify(tempUser));
  }
}
