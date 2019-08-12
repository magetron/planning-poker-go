import { User } from 'src/app/models/user'

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
  d: User[];
}