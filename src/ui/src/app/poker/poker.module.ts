import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTableModule, MatButtonModule, MatInputModule,  MatFormFieldModule, MatCardModule} from '@angular/material';

//import page 3 components here
import { PokerCardComponent } from './poker-card/poker-card.component';
import { MemberslistComponent } from './memberslist/memberslist.component';
import { PokerControlComponent } from './poker-control/poker-control.component';

@NgModule({
  declarations: [
    PokerCardComponent,
    MemberslistComponent,
    PokerControlComponent,
  ],

  //imports for mega data within other modules
  imports: [
    CommonModule,
    BrowserModule,
    FlexLayoutModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
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
