import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';
import {AuthenticationService} from '../../services/authentication.service';
import {TestMeta} from '../../models/testMeta';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  testMetas: TestMeta[] = [];

  constructor(public authenticationService: AuthenticationService, private apiService: ApiService) { }

  ngOnInit() {

    this.apiService.getAllTestsMetaInfos()
      .subscribe(res => {
        this.testMetas = res;
      });
  
      console.log(`%c                                                                    
       /$$$$$$$$  /$$    /$$$$$$   /$$$$$$    /$$    /$$$$$$   /$$$$$$                                                                                                                    
      |__  $$__//$$$$   /$$__  $$ /$$$_  $$ /$$$$   /$$__  $$ /$$__  $$                                                                                                                   
         | $$  |_  $$  |__/    $$| $$$$  $$|_  $$  |__/    $$| $$    $$                                                                                                                   
         | $$    | $$    /$$$$$$/| $$ $$ $$  | $$     /$$$$$/| $$$$$$$$                                                                                                                   
         | $$    | $$   /$$____/ | $$  $$$$  | $$    |___  $$| $$__  $$                                                                                                                   
         | $$    | $$  | $$      | $$   $$$  | $$   /$$    $$| $$  | $$                                                                                                                   
         | $$   /$$$$$$| $$$$$$$$|  $$$$$$/ /$$$$$$|  $$$$$$/| $$  | $$                                                                                                                   
         |__/  |______/|________/  ______/ |______/  ______/ |__/  |__/
         `, "font-family:monospace")
    }
}
