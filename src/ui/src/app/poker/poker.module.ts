import { NgModule, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppRoutingModule } from '../app-routing.module';


//import page 3 components here
import { PokerCardComponent } from './poker-card/poker-card.component';
import { MemberslistComponent } from './memberslist/memberslist.component';
import { PokerControlComponent } from './poker-control/poker-control.component';
import { ElapsedTimerComponent } from './elapsed-timer/elapsed-timer.component';
import { ShareComponent } from './share/share.component';

@NgModule({
  declarations: [
    PokerCardComponent,
    MemberslistComponent,
    PokerControlComponent,
    ElapsedTimerComponent,
    ShareComponent
  ],

  //imports for mega data within other modules
  imports: [
    AppRoutingModule,
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
