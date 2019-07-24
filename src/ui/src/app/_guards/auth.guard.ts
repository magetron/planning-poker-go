import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import { Router } from '@angular/router'

import { CommsService } from "../services/comms.service";
import { InternalService } from "../services/internal.service";

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private internal: InternalService,
     private comms: CommsService,
     private router: Router,
     private route: ActivatedRoute) { 
     }

  canActivate(route: ActivatedRouteSnapshot){
    const sprintId = route.params.sprint_id;

    if(this.internal.isUserAllowed()) {
      return true;
    } else {
      console.log(sprintId);
      this.router.navigateByUrl(`/join/${sprintId}`);
      return false;
    }
    
  }
  
}
