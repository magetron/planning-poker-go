import { User } from 'src/app/models/user'
import { Sprint } from 'src/app/models/sprint'

export interface SimpleResponse {
  s: number;
  d: string;
}
  
export interface ComplexResponse {
  s: number;
  d: object;
}

export interface SprintResponse {
  body: {
    s: number;
    d: Sprint;
  }
  status: number;
}
  
export interface StatusResponse {
  status: number;
}
  
export interface UserResponse {
  s: number;
  d: User[];
}