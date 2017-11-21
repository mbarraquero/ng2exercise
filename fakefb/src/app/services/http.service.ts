import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { PostType } from "../models";

@Injectable()
export class HttpService {

  constructor(
    private http: Http
  ) { }

  getUsers(): Observable<IHttpUser[]> {
    return this.http.get("http://localhost:3000/users")
      .map(response => response.json() as IHttpUser[]);
  }

  getUsersByIds(ids: number[]): Observable<IHttpUser[]> {
    return this.http.get(`http://localhost:3000/users/?${ids.map(id => `id=${id}`).join("&")}`)
      .map(response => response.json() as IHttpUser[]);
  }

  putUser(user: IHttpUser): Observable<IHttpUser> {
    return this.http.put(`http://localhost:3000/users/${user.id}`, user)
      .map(response => response.json() as IHttpUser);
  }

  getPostsByUserIds(userIds: number[]): Observable<IHttpPost[]> {
    return this.http.get(`http://localhost:3000/posts/?${userIds.map(userId => `user=${userId}`).join("&")}&type=main`)
      .map(response => response.json() as IHttpPost[]);
  }

  getPostsById(ids: number[]): Observable<IHttpPost[]> {
    return this.http.get(`http://localhost:3000/posts/?${ids.map(id => `id=${id}`).join("&")}`)
      .map(response => response.json() as IHttpPost[]);
  }

  postPost(post: IHttpPost): Observable<IHttpPost> {
    return this.http.post(`http://localhost:3000/posts`, post)
      .map(response => response.json());
  }

  putPost(post: IHttpPost): Observable<IHttpPost> {
    return this.http.put(`http://localhost:3000/posts/${post.id}`, post)
      .map(response => response.json());
  }
}

export interface IHttpUser {
  id: number;
  userName: string;
  password: string;
  fullName: string;
  friendIds: number[];
  friendRequests: number[];
  pic: string;
}

export interface IHttpPost {
  id: number;
  user: number;
  likes: number[],
  content: string;
  type: PostType;
  date: string;
  replies: number[];
}