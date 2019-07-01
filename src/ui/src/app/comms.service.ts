import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; 

import { environment } from '../environments/environment';

const HTTPOPTIONS = {
  headers: new HttpHeaders({'Conternt-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class CommsService {

  constructor(private httpClient: HttpClient) {}

  createSprint(name: string): Observable<Object> {
    let jsonObject = { Name: name };

    if (name !== "") {
      console.log("Creating sprint " + jsonObject.Name);
      const result = this.httpClient.post(
        environment.gateway + '/sprints', jsonObject, HTTPOPTIONS);
      return result;
    } else if (!environment.production) {
      console.log("Empty sprint name rejected");
      //TODO: do we need to return null here?
    }
  }
}
