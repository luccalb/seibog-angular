import { Component, OnInit, Input } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {TestResults} from '../../models/testResults';
import {MessageService} from '../../services/message.service';
import {User} from '../../models/user';
import {type} from 'os';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  @Input() targets: TestResults;

  testId = '';

  userids = [];

  users: User[];

  isLoadingReport = true;

  errorWhileLoadingReport = false;

  report: TestResults[] = [];


  constructor(private route: ActivatedRoute, private apiService: ApiService, private messageService: MessageService) { }

  ngOnInit() {
    this.testId = this.route.snapshot.paramMap.get('id');
    this.apiService.getUsers().subscribe(
      users => {
        this.users = users;

        this.apiService.getReportByTestId(this.testId).subscribe(
          data => {
            // Make latest Entry appear on top of the list
            this.report = data.reverse();
            // Get a list of UserIds to get the Faccording username from the Endpoint
            this.report.forEach(entry  => {
              if (!(this.userids.indexOf(entry.userId) > -1)) {
                this.userids.push(entry.userId);
              }
            });
            this.isLoadingReport = false;
          },
          error => {
            this.messageService.add(error.error.message || error.statusText);
            this.isLoadingReport = false;
            this.errorWhileLoadingReport = true;
          }
        );
      }
    );
  }

  getRight(results: boolean[]): Number {
    return results.filter(Boolean).length;
  }

  getUserNameById(userId): string {
    let username = '';
    this.users.forEach(user => {
      if (user._id === userId) {
        username = user.firstName + ' ' + user.lastName;
      }
    });
    return username;
  }

  dateToString(date: Date): string {
    const dat = new Date(date);
    return dat.toLocaleDateString();
  }
}
