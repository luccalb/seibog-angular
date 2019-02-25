import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $(".navbar-nav .nav-item").on("click", function(){
      $(".navbar-nav").find(".active").removeClass("active");
      $(this).addClass("active");
   });
  }

}
