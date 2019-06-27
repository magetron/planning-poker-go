import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewSprintComponent } from './new-sprint/new-sprint.component';

const routes: Routes = [
  { path: 'new', component: NewSprintComponent },
  //{ path: '', component: },
  //{ path: '', component: },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
