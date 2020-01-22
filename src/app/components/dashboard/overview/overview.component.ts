import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import {TestResults} from '../../../models/testResults';
import {ApiService} from '../../../services/api.service';
import {MessageService} from '../../../services/message.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  chart = [];

  dates = [];

  submits = [];

  reports: TestResults[] = [];

  constructor(private apiService: ApiService, private messageService: MessageService) { }

  ngOnInit() {

    this.apiService.getAllReports().subscribe(
      reports => {
        this.reports = reports;
        let tempDate = '';
        let i = 0;
        this.reports.forEach((rep, index) => {
          const date = new Date(rep.submitDate);
          if (tempDate !== date.toLocaleDateString()) {
            this.dates.push(date.toLocaleDateString());
            this.submits.push(1);
            tempDate = date.toLocaleDateString();
            if (index !== 0) {
              i++;
            }
          } else {
            this.submits[i]++;
          }
        });
        this.chart = new Chart('canvas', {
          type: 'line',
          data: {
            labels: this.dates.slice(-7),
            datasets: [
              {
                data: this.submits,
                borderColor: '#3cba9f',
                fill: false
              }
            ]
          },
          options: {
            legend: {
              display: false
            },
            scales: {
              xAxes: [{
                display: true
              }],
              yAxes: [{
                display: true
              }],
            }
          }
        });
      },
      error => {
        this.messageService.add(error.error.message || error.statusText);
      }
    );



  }

}
