import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import { Router } from '@angular/router'
import { Observable, of } from 'rxjs';

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
       //How else do I verify if this user is in this sprint??
      this.comms.getSprintUsers(sprintId).subscribe(msg => {
          if (msg && msg.s == 200) {
            return this.doIBelongHere(msg.d as User[], sprintId);
          } else { //no responce - kick
            this.router.navigateByUrl(`/join/${sprintId}`);
            return false;
          }
        })
        
       //return of(true)
    } else {
      return of(false)
    }     
  }


  doIBelongHere(users: User[], sprintId: string): boolean {
    console.info("Do I belong here?")

    let user: User
    this.internal.user$.subscribe(msg => user = msg)

    for (var i of users) {
      if (i.Id === user.Id) {
        return true
      }
    }

    // Current user not a member of this sprint
    localStorage.removeItem("user")
    console.info("Goodbye sprint" + sprintId + ". I hardly knew you")
    this.router.navigateByUrl(`/join/${sprintId}`)

    return false 
  }  
}
