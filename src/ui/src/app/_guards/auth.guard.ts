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
    
    if (this.internal.reloadOrKickUser()) {
      
      const parallel$ = forkJoin(
        this.comms.getSprintUsers(sprintId).pipe(first()),
        this.internal.user$.pipe(first())
      )

      return parallel$.pipe(map( res => {
          // res[0].d = users in the sprint(loaded from server),
          // res[1] = user loaded from local storage

          if (res[0] && res[0].s == 200 && //got response with status 200
             res[0].d && //there is a list of users in the response
             res[0].d.find(user => user.Id === res[1].Id)
          ) {
            return true
          } else {
            localStorage.removeItem("user")
            this.internal.updateUser(null)
            console.info("Goodbye sprint" + sprintId + ". I hardly knew you")

            //Explicit navigation instead of returning a UrlTree because UrlTree breaks navigation history(https://github.com/angular/angular/issues/27148)
            this.router.navigateByUrl(`/join/${sprintId}`) 
            return false
          }
        })
      )
    } else {
      this.router.navigateByUrl(`/join/${sprintId}`) 
      return of(false)
    }
  }
}
