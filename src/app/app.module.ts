import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import * as notjq from 'jquery';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestViewComponent } from './components/testView/testView.component';
import { MessagesComponent } from './components/messages/messages.component';
import {DetailComponent} from './components/dashboard/detail/detail.component';
import {OverviewComponent} from './components/dashboard/overview/overview.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {UsersComponent} from './components/dashboard/users/users.component';
import {CollectionComponent} from './components/dashboard/collection/collection.component';
import { LoginComponent } from './components/login/login.component';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import {AuthGuard} from './helpers/authGuard';
import { AdminGuard } from './helpers/adminGuard';
import { CreateTestComponent } from './components/create-test/create-test.component';
import { ReportComponent } from './components/report/report.component';
import { ProfileViewComponent } from './components/profile-view/profile-view.component';
@NgModule({
  declarations: [
    AppComponent,
    TestViewComponent,
    MessagesComponent,
    DetailComponent,
    OverviewComponent,
    NavbarComponent,
    UsersComponent,
    CollectionComponent,
    LoginComponent,
    CreateTestComponent,
    ReportComponent,
    ProfileViewComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthGuard,
    AdminGuard,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
