import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; 

import { environment } from '../environments/environment';

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

  ngOnInit() {
    this.baseUrl = location.origin;
  }

  createSprint(name: string): Observable<Response> {
    let jsonObject = { Name: name };

    if (name !== "") {
      console.log("Creating sprint " + jsonObject.Name);
      const result = this.httpClient.post<any>(
        this.baseUrl + '/sprints', jsonObject, HTTPOPTIONS);
      return result;
    } else if (!environment.production) {
      console.log("Empty sprint name rejected");
      //TODO: do we need to return null here?
    }
  }

  getSprintDetails(id: string): Observable<Response> {
    const result = this.httpClient.get<any>(
      this.baseUrl + '/sprints/' + id);
    return result; 
  }
}
