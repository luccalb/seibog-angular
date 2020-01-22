import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Answer } from '../../models/answer';
import { TestSolutions } from '../../models/testSolutions';
import { AnsweredTest } from '../../models/answeredTest';
import {Test} from '../../models/test';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';
import { MessageService } from 'src/app/services/message.service';
import { TestResults } from 'src/app/models/testResults';
declare var $: any;

@Component({
  selector: 'app-v6',
  templateUrl: './testView.component.html',
  styleUrls: ['./testView.component.css']
})
export class TestViewComponent implements OnInit {
  @Input() targets = [];


  testId = '';

  answeredTest = new AnsweredTest();

  testSubmitted = false;

  isLoadingQuestions = true;

  test: Test;

  solutionMode = false;

  reportMode = false;

  answers: Answer[] = [];

  modalImgString = "";

  // TODO: Use enums NOT_CHECKED / RIGHT / WRONG for visualisation with ngClass
  results: boolean[] = [];

  constructor(private apiService: ApiService, private route: ActivatedRoute, private authenticationService: AuthenticationService, private messageService: MessageService) { }

  ngOnDestroy() {
    if (localStorage.getItem('addSolutionsFor')) {
      localStorage.removeItem('addSolutionsFor');
    }
  }

  ngOnInit() {
    this.testId = this.route.snapshot.paramMap.get('id');
    this.apiService.getTestById(this.testId)
    .subscribe(res => {
      if (res) {
        this.test = res;
        this.isLoadingQuestions = false;

        for (let i = 0; i < this.test.questions.length; i++) {
          this.results.push(false);
          this.answers.push(new Answer(this.test.questions[i].possibleAnswers.length));
        }
        if(this.route.snapshot.paramMap.get('reportId')) {
          this.reportMode = true;
          const reportId = this.route.snapshot.paramMap.get('reportId');
          this.apiService.getReportById(reportId).subscribe(res => {
            this.results = res.results;
            this.answers = res.answers;
            this.testSubmitted = true;
          })
        }
      }
    }, err => {
      this.isLoadingQuestions = false;
    });
    if (localStorage.getItem('addSolutionsFor') === this.route.snapshot.paramMap.get('id')) {
      this.solutionMode = true;
    }
  }

  submitTest() {
    this.answeredTest.answers = this.answers;
    this.answeredTest.testId = this.testId;
    this.answeredTest.userId = this.authenticationService.currentUser._id;

  //@ts-ignore
      this.apiService.submitTest(this.answeredTest).subscribe(res => {
        this.testSubmitted = true;
        this.messageService.add("Test wurde erfolgreich abgeschickt!")
        this.apiService.getCurrentUser().subscribe(user => {
          this.authenticationService.updateUser(user);
          $(document).ready(function(){
            $('#submitModal').modal('hide');
          });
        });
      }, error => {
        this.messageService.add(error.error.message || error.statusText);
      });
  }

  submitSolutions() {
    const solutions = new TestSolutions();
    solutions.testId = this.testId;
    solutions.answers = this.answers;
    this.apiService.submitSolutions(solutions).subscribe(res => {
      this.testSubmitted = true;
      localStorage.removeItem('addSolutionsFor');
    });

  }

  imgZoom(imgString) {
    this.modalImgString = imgString;
    $(document).ready(function(){
        $('#imgModal').modal();
    });
  }

  submitPrompt() {
    $(document).ready(function(){
        $('#submitModal').modal();
    });
  }

}
