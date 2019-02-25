import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { DetailComponent } from './detail/detail.component';
import { OverviewComponent } from './overview/overview.component';
import { UsersComponent } from './users/users.component';
import { CollectionComponent } from './collection/collection.component';

const routes: Routes = [
  {
    path: 'dashboard', component: DashboardComponent,
    children: [
      {
        path: '',
        component: OverviewComponent
      },
      {
        path: 'detail',
        component: DetailComponent
      },
      {
        path: 'overview',
        component: OverviewComponent
      },
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'collection',
        component: CollectionComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
