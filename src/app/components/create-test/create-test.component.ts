import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import {Test} from '../../models/test';
import {Question} from '../../models/question';
import {ApiService} from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';

/* 
 *
 *!!!!!!!!!!!!!!!!!!!!!  AVOID READING THIS AT ALL COST !!!!!!! COULD LEAD TO INSTANT BLEEDING FROM THE EYES !!!!!!!!!!!!!
 *
*/

@Component({
  selector: 'app-create-test',
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.css']
})
export class CreateTestComponent implements OnInit {

  testForm: FormGroup;
  questions: FormArray;
  testToEdit: Test;
  editMode = false;
  testSubmitted = false;
  gotTestToEdit = false;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnDestroy() {
    if (localStorage.getItem('editTest')) {
      localStorage.removeItem('editTest');
    }
  }

  ngOnInit() {
    if (localStorage.getItem('editTest') && localStorage.getItem('editTest') === this.route.snapshot.paramMap.get('id')) {
      this.editMode = true;
    }
    if (this.editMode) {
      this.apiService.getTestById(localStorage.getItem('editTest')).subscribe(res => {
        if(res) {
          this.testToEdit = res;
          this.testForm = this.formBuilder.group({
            name: this.testToEdit.name,
            description: this.testToEdit.description,
            questions: this.formBuilder.array([]),
            participants: this.testToEdit.participants
          });
          for (let i = 0; i < this.testToEdit.questions.length; i++) {
            let questionToAdd = this.formBuilder.group({
              question: this.testToEdit.questions[i].question,
              images: this.testToEdit.questions[i].images,
              answers: this.formBuilder.array([]),
              type: "" + this.testToEdit.questions[i].type
            })
            for (let j = 0; j < this.testToEdit.questions[i].possibleAnswers.length; j++){
              let answer
              if (this.testToEdit.questions[i].type == 1) {
                answer = this.formBuilder.group({
                  possibleAnswer: this.testToEdit.questions[i].possibleAnswers[j],
                  possibleField: ''
                })
              } else if (this.testToEdit.questions[i].type == 2 || this.testToEdit.questions[i].type == 3) {
                answer = this.formBuilder.group({
                  possibleAnswer: this.testToEdit.questions[i].possibleAnswers[j],
                  possibleField: this.testToEdit.questions[i].possibleFields[j]
                })
              }
              //@ts-ignore
              questionToAdd.controls.answers.push(answer);
            }
            //@ts-ignore
            this.testForm.controls.questions.push(questionToAdd);
            this.gotTestToEdit = true;
          }
        }
      })
    } else {
      this.testForm = this.formBuilder.group({
        name: '',
        description: '',
        questions: this.formBuilder.array([ this.createQuestion() ])
      });
    }
  }

  onSubmit() {
    if (this.editMode) {
      this.mergeImagesIntoFrom(this.testForm, testForm => {
        this.parseFormToObject(testForm, parsedTest => {
          this.apiService.editTest(parsedTest).subscribe();
          localStorage.removeItem('editTest');
          this.testSubmitted = true;
        });
      })
    } else {
      this.mergeImagesIntoFrom(this.testForm, testForm => {
        this.parseFormToObject(testForm, parsedTest => {
          this.apiService.addTest(parsedTest).subscribe();
          this.testSubmitted = true;
        });
      });
    }
  }

  createQuestion(): FormGroup {
    return this.formBuilder.group({
      question: '',
      images: '',
      answers: this.formBuilder.array([this.createAnswer()]),
      type: '1'
    });
  }

  createAnswer(): FormGroup {
    return this.formBuilder.group({
      possibleAnswer: '',
      possibleField: ''
    });
  }

  addPossibleAnswer(control): void {
    control.push(this.createAnswer());
  }

  deletePossibleAnswer(control): void {
    control.removeAt(control.length - 1);
  }

  addQuestion(): void {
    this.questions = this.testForm.get('questions') as FormArray;
    this.questions.push(this.createQuestion());
  }

  deleteQuestion(index: number): void {
    this.questions = this.testForm.get('questions') as FormArray;
    this.questions.removeAt(index);
  }

  parseFormToObject(testForm: FormGroup, callback) {
    const parsedTest = new Test();

    parsedTest.name = testForm.value.name;
    parsedTest.participants = testForm.value.participants;
    parsedTest.description = testForm.value.description;
    if (this.editMode) {
      parsedTest._id = localStorage.getItem('editTest');
    }

    parsedTest.questions = [];

    for (let i = 0; i < testForm.value.questions.length; i++) {
      const q = new Question();


      q.possibleAnswers = [];
      q.possibleFields = [];
      q.images = testForm.value.questions[i].images;
      q.question = testForm.value.questions[i].question;
      q.type = parseInt(testForm.value.questions[i].type, 10);

      for (let j = 0; j < testForm.value.questions[i].answers.length; j++) {
        q.possibleAnswers.push(testForm.value.questions[i].answers[j].possibleAnswer);
        if (q.type === 2 || q.type == 3) {
          q.possibleFields.push(testForm.value.questions[i].answers[j].possibleField);
        }
      }
      parsedTest.questions.push(q);
    }
    callback(parsedTest);
  }

  get questionsData() { return <FormArray>this.testForm.get('questions'); }

  log() {
    this.mergeImagesIntoFrom(this.testForm, testForm => {
      this.parseFormToObject(testForm, parsedTest => {
        console.log(parsedTest);
      });
    });
  }

  getBase64(file, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      callback(reader.result.toString());
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
      callback('');
    };
  }

  mergeImagesIntoFrom(testForm: FormGroup, callback) {
    let results = 0;
    testForm.value.questions.forEach((question, i) => {
      const imgId = 'question' + i + 'Img';

      this.getImageStringFromInput(imgId, imgString => {
        if(!question.images || (imgString && question.images != imgString) ) {
          question.images = imgString;
        }
        if(results === testForm.value.questions.length-1) {
          callback(testForm);
        }
        results++;
      });
    });
  }

  getImageStringFromInput(imgId: string, callback) {
    const image = document.getElementById(imgId);
    // @ts-ignore
    if(image.files[0]){
      // @ts-ignore
      this.getBase64(image.files[0], imgString => {
        callback(imgString);
      })
    } else {
      callback('');
    }
  
  }
}
