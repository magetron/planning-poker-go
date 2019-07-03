import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; 

import { environment } from '../../environments/environment';
import * as globals from './globals.service';
import { User } from '../models/user';
import { Sprint } from '../models/sprint';

const HTTPOPTIONS = {
  headers: new HttpHeaders({'Content-Type': 'application/json' })
};

export interface Response {
  s: number;
  d: string;
}

@Injectable({
  providedIn: 'root'
})

export class CommsService {
  baseUrl: string = '';

  constructor(private httpClient: HttpClient) {}

  createSprint(name: string): Observable<Response> {
    let jsonObject = { Name: name };

    if (name !== "") {
      console.log("Creating sprint " + jsonObject.Name);
      const result = this.httpClient.post<Response>(
        globals.apiUrl + '/sprints', jsonObject, HTTPOPTIONS);
      return result;
    } else if (!environment.production) {
      console.log("Empty sprint name rejected");
      //TODO: do we need to return null here?
    }
  }

  getSprintDetails(id: string): Observable<Response> {
    const result = this.httpClient.get<Response>(
      globals.apiUrl + '/sprints/' + id, HTTPOPTIONS);
    return result; 
  }

  joinSprint(user: User, sprint: Sprint) {
    let jsonObject = {
      user_id: user.id,
      user_name: user.name,
      //TODO: ask Patric about format
    }

    const result = this.httpClient.post<Response>(
      globals.apiUrl + '/sprints/' + sprint.id, jsonObject, HTTPOPTIONS);
    return result;
  }
}
