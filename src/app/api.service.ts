import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Question } from './models/question';
import { environment } from '../environments/environment';
import { TestSheet } from './models/testSheet';
import { TestSolutions } from './models/testSolutions';
import { User } from './models/user';
import { TestResults } from './models/testResults';

/**
 * TODO: Split in Micro-Services
 */

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  API_URL: string = environment.apiUrl + '/questions';

  RESULT_URL: string = environment.apiUrl + '/results';

  SOLUTIONS_URL: string = environment.apiUrl + '/solutions';

  USER_URL: string = environment.apiUrl + '/users';

  SUBMIT_URL: string = environment.apiUrl + '/submit';

  constructor(private http: HttpClient) { }

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.API_URL)
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.USER_URL)
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.USER_URL, user, httpOptions);
  }

  updateUserScore(user: User): any {
    const url = `${this.USER_URL}/${user._id}`
    return this.http.put<User>(url, user, httpOptions);
  }

  submitTest(sheet: TestSheet): Observable<TestSheet> {
    return this.http.post<TestSheet>(this.SUBMIT_URL, sheet, httpOptions)
    .pipe(
      catchError(this.handleError<any>('submitTest'))
    );
  }

  getSolutions(testVersion: String): Observable<TestSolutions> {
    const url = `${this.SOLUTIONS_URL}/${testVersion}`;
    return this.http.get<TestSolutions>(url).pipe(
      catchError(this.handleError<TestSolutions>(`getSolutions version=${testVersion}`))
    );
  }

  addResults(testResults: TestResults): Observable<TestResults> {
    return this.http.post<TestResults>(this.RESULT_URL, testResults, httpOptions)
    .pipe(
      catchError(this.handleError<any>('createResultSheet'))
    )
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    }
  }
}
