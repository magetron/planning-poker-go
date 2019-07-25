import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import { Router } from '@angular/router'
import { Observable, of, merge } from 'rxjs';
import { catchError, tap, flatMap, mergeMap, map } from 'rxjs/operators';
import { forkJoin } from 'rxjs/index';

import { CommsService } from "../services/comms.service";
import { InternalService } from "../services/internal.service";
import { User } from "../models/user";

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private internal: InternalService,
     private comms: CommsService,
     private router: Router,
     private route: ActivatedRoute) { 
     }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const sprintId = route.params.sprint_id;

    if (this.internal.reloadOrKickUser()) {
      
      const test$ = forkJoin(
        this.comms.getSprintUsers(sprintId),
        this.internal.user$
      )
      console.info("Verifying user")
      
      return test$.pipe(map( res => {
          console.info("Subscription resolved")
          /*
          Legend: res[0].d = users, res[1] = user
          */

          if (res[0] && res[0].s == 200) {
            for (var i of res[0].d as User[]) {
              if (i.Id === res[1].Id) {
                return true
              }
            }
          }
          this.kickMeToJoin(sprintId)
          return false
        })
      )
      /*
      this.comms.getSprintUsers(sprintId).subscribe(msg => {
          if (msg && msg.s == 200) {
            return this.doIBelongHere(msg.d as User[], sprintId)
          } else { //no responce - kick
            this.router.navigateByUrl(`/join/${sprintId}`)
            return false
          }
        })
        */
       //return of(true)
    } else {
      this.kickMeToJoin(sprintId)
      return of(false)
    }     
  }

/*
  doIBelongHere(users: User[], sprintId: string): Observable<boolean> {
    console.info("Do I belong here?")

    let user: User
    this.internal.user$.pipe(
      catchError(err => {
        this.kickMeToJoin(sprintId)
        return null
      })
    ).subscribe(msg => {
      user = msg as User

      for (var i of users) {
        if (i.Id === user.Id) {
          return true
        }
      }

      this.kickMeToJoin(sprintId)
      return false
    },
    )
  }*/

  kickMeToJoin(sprintId: string): void {
    // Current user not a member of this sprint
    localStorage.removeItem("user")
    console.info("Goodbye sprint" + sprintId + ". I hardly knew you")
    this.router.navigateByUrl(`/join/${sprintId}`)
  }

}
