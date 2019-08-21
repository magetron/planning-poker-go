import { User } from 'src/app/models/user'
import { Sprint } from 'src/app/models/sprint'
import { Round } from 'src/app/models/round';

export interface SprintResponse {
  body: {
    s: number;
    d: Sprint;
  }
  status: number;
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

export interface UserResponse {
  s: number;
  d: {
    Users : {[key: string]: User},
    SprintId : string,
    VotesShown : boolean,
    AdminId : string
  };
}
