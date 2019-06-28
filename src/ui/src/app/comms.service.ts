import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CommsService {

  constructor(private httpClient: HttpClient) {}

  //TODO: add type!
  createSprint(name: string): any {
    console.log(name);
    if (name !== "") {

      const result = this.httpClient.post(environment.gateway + '/sprints', name );
      return result;
    } else if (!environment.production) {
      console.log("Empty sprint name rejected");
    }
  }
}
