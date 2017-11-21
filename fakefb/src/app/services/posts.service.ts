import { Injectable } from '@angular/core';
import { HttpService, IHttpPost } from './http.service';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { IPost, IUser } from '../models';

@Injectable()
export class PostsService {

  constructor(
    private httpService: HttpService,
    private userService: UserService
  ) { }

  getPosts(userIds: number[]): Observable<IPost[]> {
    return this.httpService.getPostsByUserIds(userIds).mergeMap(httpPosts => {
      let repliesIds = [].concat.apply([], httpPosts.map(httpPost => httpPost.replies));
      return this.httpService.getPostsById(repliesIds).map(httpReplies => {
        return httpPosts.map(httpPost => this.getPost(httpPost, httpReplies));
      });
    });
  }

  private getPost(httpPost: IHttpPost, httpReplies: IHttpPost[]): IPost {
    let post = this.translatePost(httpPost);
    let filteredHttpReplies = httpPost.replies ? httpReplies.filter(httpReply => httpPost.replies.some(postReplyId => postReplyId === httpReply.id)) : [];
    post.replies = filteredHttpReplies.map(filteredHttpReply => this.translatePost(filteredHttpReply));
    return post;
  }

  private translatePost(httpPost: IHttpPost): IPost {
    let post = <IPost>{
      id: httpPost.id,
      content: httpPost.content,
      type: httpPost.type,
      date: new Date(httpPost.date)
    };
    post.user = this.userService.cachedBaseUsers.find(user => httpPost.user === user.id);
    post.likes = this.userService.cachedBaseUsers.filter(user => httpPost.likes.some(likeId => likeId === user.id));
    return post;
  }

  savePost(post: IPost): Observable<IPost> {
    return this.httpService.postPost(this.getHttpPost(post)).map(httpPost => this.getPost(httpPost, []));
  }

  private getHttpPost(post: IPost): IHttpPost {
    let httpPost = <IHttpPost>{
      id: post.id,
      user: post.user.id,
      type: post.type,
      content: this.cleanContent(post.content),
      date: post.date.toUTCString()
    };
    httpPost.likes = post.likes ? post.likes.map(like => like.id) : [];
    if (post.type === "main") httpPost.replies = post.replies ? post.replies.map(reply => reply.id) : [];
    return httpPost;
  }

  private cleanContent(content: string): string {
    let newLine = "\n";
    return content.endsWith(newLine) ? content.slice(0, content.length - newLine.length) : content;
  }

  saveReply(post: IPost, reply: IPost): Observable<IPost> {
    return this.httpService.postPost(this.getHttpPost(reply)).flatMap(httpReply => {
      let httpPost = this.getHttpPost(post);
      httpPost.replies.push(httpReply.id);
      return this.httpService.putPost(httpPost).map(() => {
        return this.getPost(httpReply, []);
      });
    });
  }

  likePost(post: IPost, user: IUser): Observable<IPost> {
    let httpPost = this.getHttpPost(post);
    httpPost.likes.push(user.id);
    return this.httpService.putPost(httpPost).map(() => {
      post.likes.push(user);
      return post;
    })
  }

  dislikePost(post: IPost, user: IUser): Observable<IPost> {
    let httpPost = this.getHttpPost(post);
    httpPost.likes = httpPost.likes.filter(userId => userId !== user.id);
    return this.httpService.putPost(httpPost).map(() => {
      post.likes = post.likes.filter(eachUser => eachUser.id != eachUser.id);
      return post;
    })
  }
}
