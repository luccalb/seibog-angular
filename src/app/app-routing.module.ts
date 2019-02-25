import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { V6Component } from './v6/v6.component';

const routes: Routes = [
  { path: 'v6', component: V6Component },
  { path: '', component: V6Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
