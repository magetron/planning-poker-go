import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NewSprintComponent } from './new-sprint/new-sprint.component';
import { ShareComponent } from './share/share.component';

@NgModule({
  declarations: [
    AppComponent,
    NewSprintComponent,
    ShareComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {
  
}
