import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {TestMeta} from '../../../models/testMeta';
import {AuthenticationService} from '../../../services/authentication.service';
declare var $: any;

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {

  public testMetas: TestMeta[] = [];

  loadingMetas = true;

  deleteName = '';
  deleteId = '';

  constructor(private apiService: ApiService, public authService: AuthenticationService) { }

  ngOnInit() {
    this.apiService.getAllTestsMetaInfos()
      .subscribe(res => {
        this.testMetas = res;

        this.testMetas.forEach(meta => {
          this.apiService.checkForSolutions(meta._id)
            .subscribe(sol => {
              meta.solutions = sol.solutions;
              this.loadingMetas = false;
            });
        });
      });
  }

  switchMode(testId) {
    localStorage.setItem('addSolutionsFor', testId);
  }

  switchEditMode(testId) {
    localStorage.setItem('editTest', testId);
  }

  updateSolutionsMode(testId) {
    localStorage.setItem('updateSolutionsFor', testId);
  }

  deleteTest() {
    this.apiService.removeTest(this.deleteId).subscribe(res =>{
      location.reload();
    });
  }

  deletePrompt(test) {
    this.deleteId = test._id;
    this.deleteName = test.name;
    $(document).ready(function(){
        $('#deleteModal').modal();
    });
  }
}
