import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AnsweredTest } from '../models/answeredTest';
import { User } from '../models/user';
import { MessageService} from './message.service';
import {Test} from '../models/test';
import {TestResults} from '../models/testResults';
import {TestMeta} from '../models/testMeta';
import {TestSolutions} from '../models/testSolutions';

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

  TESTS_URL: string = environment.apiUrl + '/tests';

  RESULTS_URL: string = environment.apiUrl + '/results';

  USER_URL: string = environment.apiUrl + '/users';

  SUBMIT_URL: string = environment.apiUrl + '/tests/submitUserTest';

  constructor(private http: HttpClient, private messageService: MessageService) { }

  getTestById(testId): Observable<Test> {
    const url = `${this.TESTS_URL}/${testId}`;
    return this.http.get<Test>(url).pipe(
      catchError(this.handleError<any>('getQuestions'))
    );
  }

  getReportByTestId(testId): Observable<TestResults[]> {
    const url = `${this.TESTS_URL}/${testId}/report`;
    return this.http.get<TestResults[]>(url);
  }

  getReportById(reportId): Observable<TestResults> {
    const url =`${this.RESULTS_URL}/${reportId}`;
    return this.http.get<TestResults>(url);
  }

  getAllReports(): Observable<TestResults[]> {
    const url = `${this.TESTS_URL}/report`;
    return this.http.get<TestResults[]>(url);
  }

  getAllTestsMetaInfos(): Observable<TestMeta[]> {
    return this.http.get<TestMeta[]>(`${this.TESTS_URL}/meta`)
      .pipe(
        catchError(this.handleError<any>('getTestsMetaInfos'))
      );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.USER_URL).pipe(
      catchError(this.handleError<any>('getUsers'))
    );
  }

  getUserById(userId): Observable<User> {
    const url = `${this.USER_URL}/${userId}`;
    return this.http.get<User>(url);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.USER_URL}/current`).pipe(
      catchError(this.handleError<any>('getCurrentUser'))
    );
  }

  addUser(user: User) {
    return this.http.post(`${this.USER_URL}/register`, user);
  }

  submitTest(sheet: AnsweredTest): Observable<TestResults> {
    return this.http.post<TestResults>(this.SUBMIT_URL, sheet, httpOptions);
  }

  addTest(test: Test): Observable<Test> {
    return this.http.post<Test>(this.TESTS_URL, test)
      .pipe(
        catchError(this.handleError<any>('addTest'))
      );
  }

  editTest(test: Test): Observable<Test> {
    const url = `${this.TESTS_URL}/${test._id}`
    return this.http.put<Test>(url, test);
  }

  removeTest(testId): Observable<any> {
    const url = `${this.TESTS_URL}/${testId}`;
    return this.http.delete<any>(url);
  }

  checkForSolutions(testId): Observable<any> {
    const url = `${this.TESTS_URL}/${testId}/solutions/check`;
    return this.http.get<any>(url);
  }

  getSolutions(testId): Observable<any> {
    const url =  `${this.TESTS_URL}/${testId}/solutions`;
    return this.http.get<any>(url);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.messageService.add('ERROR: ' + operation);

      return of(result as T);
    };
  }

  submitSolutions(solutions: TestSolutions) {
    return this.http.post(`${this.TESTS_URL}/solutions`, solutions);
  }
}
