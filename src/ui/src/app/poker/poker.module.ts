import { NgModule } from '@angular/core';
import { Brows
  erModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';

//import page 3 components here
import { PokerCardComponentComponent } from './poker-card-component/mp-card-component.component';

@NgModule({
  //imports for mega data within other modules
  imports: [
    BrowserModule,
    FlexLayoutModule,
  ],

  //service
  providers:[],

  declarations: [
    PokerCardComponentComponent,
  ],

  exports: [
    PokerCardComponentComponent,
  ],

  bootstrap: []
})

export class MainpageModule { }
