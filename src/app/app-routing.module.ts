import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestViewComponent } from './components/testView/testView.component';
import {OverviewComponent} from './components/dashboard/overview/overview.component';
import {CollectionComponent} from './components/dashboard/collection/collection.component';
import {UsersComponent} from './components/dashboard/users/users.component';
import {LoginComponent} from './components/login/login.component';
import {AuthGuard} from './helpers/authGuard';
import {CreateTestComponent} from './components/create-test/create-test.component';
import {AdminGuard} from './helpers/adminGuard';
import {ReportComponent} from './components/report/report.component';
import { ProfileViewComponent } from './components/profile-view/profile-view.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard/collection' , pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'dashboard/overview' , component: OverviewComponent, canActivate: [AdminGuard]},
  { path: 'dashboard/collection', component: CollectionComponent },
  { path: 'dashboard/create', component: CreateTestComponent, canActivate: [AdminGuard] },
  { path: 'dashboard/edit/:id', component: CreateTestComponent, canActivate: [AdminGuard] },
  { path: 'dashboard/users', component: UsersComponent, canActivate: [AdminGuard]},
  { path: 'test/:id', component: TestViewComponent, canActivate: [AuthGuard] },
  { path: 'test/:id/solutions', component: TestViewComponent, canActivate: [AdminGuard] },
  { path: 'test/:id/report', component: ReportComponent, canActivate: [AdminGuard] },
  { path: 'test/:id/report/:reportId', component: TestViewComponent, canActivate: [AdminGuard] },
  { path: 'users/:userId', component: ProfileViewComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'dashboard/collection'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    enableTracing: false
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
