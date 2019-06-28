import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NewSprintComponent } from './new-sprint/new-sprint.component';
import { ShareComponent } from './share/share.component';
import { CommsService } from './comms.service';

@NgModule({
  declarations: [
    AppComponent,
    NewSprintComponent,
    ShareComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [ CommsService ],
  bootstrap: [ AppComponent ]
})

export class AppModule {
  
}
