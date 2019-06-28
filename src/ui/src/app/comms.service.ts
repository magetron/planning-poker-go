import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 

import { environment } from '../environments/environment';

const HTTPOPTIONS = {
  headers: new HttpHeaders({'Conternt-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class CommsService {

  constructor(private httpClient: HttpClient) {}

  //TODO: add type!
  createSprint(name: string): any {
    let jsonObject = { Name: name };

    if (name !== "") {
      console.log("Creating sprint " + jsonObject.Name);
      const result = this.httpClient.post(
        environment.gateway + '/sprints', jsonObject, HTTPOPTIONS);
      return result;
    } else if (!environment.production) {
      console.log("Empty sprint name rejected");
    }
  }
}
