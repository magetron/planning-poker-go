import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import { Router } from '@angular/router'
import { Observable, of, merge } from 'rxjs';
import { catchError, tap, flatMap, mergeMap, map, take, first } from 'rxjs/operators';
import { forkJoin } from 'rxjs/index';

import { CommsService } from "../services/comms.service";
import { InternalService } from "../services/internal.service";
import { User } from "../models/user";

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  success: boolean = false;

  constructor(private internal: InternalService,
     private comms: CommsService,
     private router: Router,
     public route: ActivatedRoute) { 
     }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const sprintId = route.params.sprint_id;
    /*
    const myUser: User = JSON.parse(localStorage.getItem('user'));
    return this.checkLogin(sprintId, myUser)
      
    }
    
    public checkUser: boolean;
    checkLogin(sprintId, myUser): Observable<boolean> {

      this.comms.getSprintUsers(sprintId).pipe(
        take(1),
        map(users => {
        console.log(users);

        (users.d && !!users.d.find(user => {
          return user.Id === myUser.Id;
        }))
        if (this.checkUser){
          return true
        } else {
          return false;
        }

      }))

    }


*/
    if (this.internal.reloadOrKickUser()) {
      
      const test$ = forkJoin(
        this.comms.getSprintUsers(sprintId).pipe(first()),
        this.internal.user$.pipe(first())
        //of(localStorage.getItem("user"))
      )

      return test$.pipe(map( res => {
          console.info("Subscription resolved")

          //Legend: res[0].d = users, res[1] = user

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
    }
  }

  kickMeToJoin(sprintId: string): void {
    // Current user not a member of this sprint
    localStorage.removeItem("user")
    console.info("Goodbye sprint" + sprintId + ". I hardly knew you")
    this.router.navigateByUrl(`/join/${sprintId}`)
  }

}
