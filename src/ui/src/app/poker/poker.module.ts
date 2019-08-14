import { NgModule, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule, MatListModule, MatTableModule, MatButtonModule, MatInputModule,  MatFormFieldModule, MatCardModule,  MatToolbarModule} from '@angular/material';

//import page 3 components here
import { PokerCardComponent } from './poker-card/poker-card.component';
import { MemberslistComponent } from './memberslist/memberslist.component';
import { PokerControlComponent } from './poker-control/poker-control.component';
import { ElapsedTimerComponent } from './elapsed-timer/elapsed-timer.component';

@NgModule({
  declarations: [
    PokerCardComponent,
    MemberslistComponent,
    PokerControlComponent,
    ElapsedTimerComponent
  ],

  //imports for mega data within other modules
  imports: [
    CommonModule,
    BrowserModule,
    FlexLayoutModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatToolbarModule,
    FormsModule
  ],

  //service
  providers:[],

  exports: [
    CommonModule,
    PokerCardComponent,
    PokerControlComponent
  ],

  bootstrap: []
})

export class PokerModule { }
