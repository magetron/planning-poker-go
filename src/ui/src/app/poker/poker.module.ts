import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

//import page 3 components here
import { PokerCardComponent } from './poker-card/poker-card.component';
import { MemberslistComponent } from './memberslist/memberslist.component';

@NgModule({
  //imports for mega data within other modules
  imports: [
    CommonModule,
    BrowserModule,
    FlexLayoutModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule
  ],

  //service
  providers:[],

  declarations: [
    PokerCardComponent,
    MemberslistComponent,
  ],

  exports: [
    CommonModule,
    PokerCardComponent,
  ],

  bootstrap: []
})

export class PokerModule { }
