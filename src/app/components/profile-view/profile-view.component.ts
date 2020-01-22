import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { TestResults } from 'src/app/models/testResults';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {

  constructor(private apiService: ApiService, private route: ActivatedRoute, private messageService: MessageService) { }

  user: User;

  entry: {
    testId: '',
    _id: ''
  }

  reports: TestResults;

  isLoadingUser = true;

  errorWhileLoadingUser = false;

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('userId');
    this.apiService.getUserById(userId).subscribe(res => {
      this.user = res;
      this.isLoadingUser = false;
    }, err => {
      this.messageService.add(err.error.message || err.statusText);
      this.isLoadingUser = false;
      this.errorWhileLoadingUser = true;
    })
  }
}
