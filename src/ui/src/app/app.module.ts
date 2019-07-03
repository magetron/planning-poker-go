import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PokerModule } from './poker/poker.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NewSprintComponent } from './new-sprint/new-sprint.component';
import { ShareComponent } from './share/share.component';
import { CommsService } from './services/comms.service';
import { JoinComponent } from './join/join.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, MatIconModule } from '@angular/material';
import { TopBarComponent } from './top-bar/top-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    NewSprintComponent,
    ShareComponent,
    JoinComponent,
    TopBarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    PokerModule
  ],
  providers: [ CommsService ],
  bootstrap: [ AppComponent ]
})

export class AppModule {

}
