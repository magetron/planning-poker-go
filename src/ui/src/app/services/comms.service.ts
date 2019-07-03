import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; 

import * as globals from './globals.service';
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
        `${globals.apiUrl}/sprints`, jsonObject, HTTPOPTIONS);
      return result;
    } else {
      console.log("Empty sprint name rejected");
      //TODO: do we need to return null here?
    }
  }

  getSprintDetails(id: string): Observable<Response> {
    const result = this.httpClient.get<Response>(
      `${globals.apiUrl}/sprints/${id}`, HTTPOPTIONS);
    return result; 
  }

  joinSprint(username: string, sprint: Sprint) {
    let jsonObject = {
      Name: username,
    }

    const result = this.httpClient.post<Response>(
      `${globals.apiUrl}/sprints/${sprint.id}/users`, jsonObject, HTTPOPTIONS);
    return result;
  }
}
