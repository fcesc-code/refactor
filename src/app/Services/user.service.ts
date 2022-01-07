import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDTO } from '../Models/user.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private urlBlogUocApi: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'users';
    this.urlBlogUocApi = 'http://localhost:3000/' + this.controller;
  }

  register(user: UserDTO): Promise<UserDTO> {
    return this.http.post<UserDTO>(this.urlBlogUocApi, user).toPromise();
  }

  updateUser(userId: string, user: UserDTO): Promise<UserDTO> {
    return this.http
      .put<UserDTO>(this.urlBlogUocApi + '/' + userId, user)
      .toPromise();
  }

  getUSerById(userId: string): Promise<UserDTO> {
    return this.http
      .get<UserDTO>(this.urlBlogUocApi + '/' + userId)
      .toPromise();
  }
}
