import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewSprintComponent } from './new-sprint/new-sprint.component';
import { JoinComponent } from './join/join.component';

const routes: Routes = [
  { path: 'new', component: NewSprintComponent },
  { path: 'join/:sprint_id', component: JoinComponent }, //TODO: use the right parameter
  //{ path: 'session', component: },
  { path: '',   redirectTo: '/new', pathMatch: 'full' },
  //{ path: '*', component: PageNotFound } //TODO
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
