import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewSprintComponent } from './new-sprint/new-sprint.component';
import { JoinComponent } from './join/join.component';
import { PokerControlComponent } from './poker/poker-control/poker-control.component';


const routes: Routes = [
  { path: 'new', component: NewSprintComponent },
  { path: 'join/:sprint_id', component: JoinComponent },
  { path: 'table/:sprint_id', component: PokerControlComponent },
  //{ path: 'session', component: },
  { path: '',   redirectTo: '/new', pathMatch: 'full' },
  { path: 'index', redirectTo: '/new' },
  //{ path: '*', component: PageNotFound } //TODO
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {useHash: true}),
  ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
