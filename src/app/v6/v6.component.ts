import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { User } from '../models/user';
import { Question } from '../models/question';
import { Answer } from '../models/answer';
import { TestSheet } from '../models/testSheet';
import { TestResults } from '../models/testResults';

@Component({
  selector: 'app-v6',
  templateUrl: './v6.component.html',
  styleUrls: ['./v6.component.css']
})
export class V6Component implements OnInit {

  version = 'v6';

  testSheet = new TestSheet();

  nameSubmitted = false;

  testSubmitted = false;

  isLoadingQuestions = true;

  errorWhileLoadingQuestions = false;

  dbusers: User[] = [];

  user = new User();

  selectedUsername: string;

  createdUsername: string;

  usernameTaken = false;

  questions: Question[] = [];

  answers: Answer[] = [];

  rightAnswers: Answer[];

  //TODO: Use enums NOT_CHECKED / RIGHT / WRONG for visualisation with ngClass
  results: boolean[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getQuestions()
      .subscribe(res => {
        this.questions = res;
        this.isLoadingQuestions = false;

        for (var i = 0; i < this.questions.length; i++) {
          this.results.push(false);
          this.answers.push(new Answer(this.questions[i].possibleAnswers.length));
        }
      }, err => {
        this.isLoadingQuestions = false;
        this.errorWhileLoadingQuestions = true;
      })

    this.apiService.getUsers()
      .subscribe(res => {
        this.dbusers = res;
      });
    this.selectedUsername = "keine Auswahl";
    this.createdUsername = "";
  }

  onNameSubmit() {
    if (this.createdUsername != '') {
      this.user.name = this.createdUsername;
      this.apiService.addUser(this.user).subscribe(res => {
        this.user = res;
        this.nameSubmitted = true;
      }, err => {
        if (err.status == 400) {
          this.usernameTaken = true;
        }
      });
    } else {
      for(let i = 0; i < this.dbusers.length; i++){
        if(this.dbusers[i].name == this.selectedUsername ){
          this.user = this.dbusers[i];
          this.nameSubmitted = true;
        }
      }
    }
  }

  submitTest() {
    this.testSheet.user = this.user;
    this.testSheet.answers = this.answers;
    this.testSheet.version = this.version;

    this.apiService.submitTest(this.testSheet).subscribe(res => {
      // Schreiben der ID in das lokale Objekt
      this.testSheet = res;
    });
    this.getRightAnswers(this.testSheet.version);
    this.testSubmitted = true;
  }

  getRightAnswers(forVersion: string) {
    this.apiService.getSolutions(forVersion).subscribe(res => {
      this.rightAnswers = res.answers;
      this.writeResults();
    })
  }

  writeResults() {
    for (var i = 0; i < this.rightAnswers.length; i++) {
      if (JSON.stringify(this.rightAnswers[i].chosenFields) == JSON.stringify(this.testSheet.answers[i].chosenFields) && JSON.stringify(this.rightAnswers[i].tickedBoxes) == JSON.stringify(this.testSheet.answers[i].tickedBoxes)) {
        this.results[i] = true;
        this.user.score += 10;
      }
    }
    const testResults = new TestResults();
    testResults.userid = this.user._id;
    testResults.results = this.results;
    testResults.version = this.version;

    this.apiService.addResults(testResults).subscribe();
    this.apiService.updateUserScore(this.user).subscribe();
  }

}
