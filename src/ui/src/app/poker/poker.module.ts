import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material';

//import page 3 components here
import { PokerCardComponent } from './poker-card/poker-card.component';

@NgModule({
  //imports for mega data within other modules
  imports: [
    CommonModule,
    BrowserModule,
    FlexLayoutModule,
    MatCardModule
  ],

  //service
  providers:[],

  declarations: [
    PokerCardComponent,
  ],

  exports: [
    CommonModule,
    PokerCardComponent,
  ],

  bootstrap: []
})

export class PokerModule { }
