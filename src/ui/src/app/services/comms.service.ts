import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import * as globals from './globals.service';
import { Sprint } from '../models/sprint';

const HTTPOPTIONS = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

const HTTPOPTIONS_NO_BODY = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  observe: "response" as 'body',
}

export interface SimpleResponse {
  s: number;
  d: string;
}

export interface ComplexResponse {
  s: number;
  d: object;
}

export interface StatusResponse {
  status: number;
}

@Injectable({
  providedIn: 'root'
})

export class CommsService {
  baseUrl: string = '';

  constructor(private httpClient: HttpClient) {}

  createSprint(name: string): Observable<SimpleResponse> {
    let jsonObject = { Name: name };

    if (name !== "") {
      console.log("Creating sprint " + jsonObject.Name);
      const result = this.httpClient.post<SimpleResponse>(
        `${globals.apiUrl}/sprints`, jsonObject, HTTPOPTIONS);
      return result;
    } else {
      console.log("Empty sprint name rejected");
      //TODO: do we need to return null here?
    }
  }

  getSprintDetails(id: string): Observable<ComplexResponse> {
    const result = this.httpClient.get<ComplexResponse>(
      `${globals.apiUrl}/sprints/${id}`, HTTPOPTIONS);
    return result;
  }

  joinSprint(username: string, sprint: Sprint): Observable<ComplexResponse> {
    let jsonObject = {
      Name: username,
    }

    const result = this.httpClient.post<ComplexResponse>(
      `${globals.apiUrl}/sprints/${sprint.Id}/users`, jsonObject, HTTPOPTIONS);
    return result;
  }

  getSprintUsers(sprint_id: string) : Observable<ComplexResponse>{
    const result = this.httpClient.get<ComplexResponse>(
      `${globals.apiUrl}/sprints/${sprint_id}/users`, HTTPOPTIONS);
    return result;
  }

  //TODO: WTH does this observable contain?
  selectCard(sprint_id: string, user_id: string, vote: number): Observable<any> {
    let jsonObject = {
      "Vote": vote,
    }
    const result = this.httpClient.put<SimpleResponse>(
      `${globals.apiUrl}/sprints/${sprint_id}/users/${user_id}`,
       jsonObject, HTTPOPTIONS_NO_BODY);
    return result;
  }

  appointSuccessor(sprint_id: string, user_id: string, successor_id:string): Observable<any> {
    let jsonObject = {
      "Successor": successor_id
    }
    const result = this.httpClient.post<SimpleResponse>(
      `${globals.apiUrl}/sprints/${sprint_id}/users/${user_id}/setadmin`,
       jsonObject, HTTPOPTIONS_NO_BODY);
    return result;
  }

  addStory (sprint_id: string, sprint_story: string): Observable<any>{
    let jsonObject = {
      "Name": sprint_story,
    }
    const result = this.httpClient.post<SimpleResponse>(
      `${globals.apiUrl}/sprints/${sprint_id}/rounds`,
       jsonObject, HTTPOPTIONS_NO_BODY);
    return result;
  }

  archiveRound (sprint_id: string, round_no:number, avg: number, med:number, fin:number): Observable<any>{
    let jsonObject = {
      "Average": avg,
      "Median": med,
      "Final": fin,
    }
    const result = this.httpClient.put<SimpleResponse>(
      `${globals.apiUrl}/sprints/${sprint_id}/rounds/${round_no}`,
       jsonObject, HTTPOPTIONS_NO_BODY);
    return result;
  }

  deleteUser (sprint_id: string, user_id: string): Observable<any>{
    const result = this.httpClient.delete<SimpleResponse>(
      `${globals.apiUrl}/sprints/${sprint_id}/users/${user_id}`,HTTPOPTIONS);
    return result;
  }

  getUserDetails (sprint_id: string, user_id: string): Observable<ComplexResponse>{
    const result = this.httpClient.get<ComplexResponse>(
      `${globals.apiUrl}/sprints/${sprint_id}/users/${user_id}`, HTTPOPTIONS);
    return result;
  }

  showVote (sprint_id: string, user_id: string, showVote : boolean): Observable<StatusResponse>{
    let jsonObject = {
      "VoteShown": showVote,
    }
    const result = this.httpClient.post<StatusResponse>(
      `${globals.apiUrl}/sprints/${sprint_id}/users/${user_id}/showvote`, jsonObject, HTTPOPTIONS_NO_BODY);
    return result;
  }
}
