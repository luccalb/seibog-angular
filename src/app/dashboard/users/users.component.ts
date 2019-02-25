import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor(private apiService: ApiService) { }

  users: User[] = [];

  isLoadingUsers = true;

  errorWhileLoadingUsers = false;

  ngOnInit() {
    this.apiService.getUsers().subscribe(res => {
      this.users = res;
      this.isLoadingUsers = false;
    }, err => {
      this.errorWhileLoadingUsers = true;
      this.isLoadingUsers = false;
    })
  }

}
