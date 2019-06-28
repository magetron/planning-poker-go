import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewSprintComponent } from './new-sprint/new-sprint.component';

const routes: Routes = [
  { path: 'new', component: NewSprintComponent },
  //{ path: 'join', component: },
  //{ path: 'session', component: },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
