import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { HttpService, IHttpUser } from './http.service';
import { IUser } from '../models';

@Injectable()
export class UserService {

  cachedHttpUsers: IHttpUser[];
  cachedBaseUsers: IUser[];

  constructor(
    private httpService: HttpService,
  ) { }

  getAllBaseUsers(): Observable<IUser[]> {
    return this.httpService.getUsers().map(httpUsers => {
      this.cachedHttpUsers = httpUsers;
      this.cachedBaseUsers = httpUsers.map(this.translateUser);
      return this.cachedBaseUsers;
    })
  }

  getFullUser(baseUser: IUser): Observable<IUser> {
    let httpUser = this.cachedHttpUsers.find(cachedUser => cachedUser.id === baseUser.id);
    return this.httpService.getUsersByIds(httpUser.friendIds.concat(httpUser.friendRequests))
      .map(httpOthers => {
        let httpFriends = this.getHttpFriends(httpUser, httpOthers);
        let httpFriendRequests = this.getHttpFriendRequests(httpUser, httpOthers);
        return this.getUserWithFriendsUsingFriends(httpUser, httpFriends, httpFriendRequests);
      });
  }

  getUser(id: number): Observable<IUser> {
    return this.httpService.getUsersByIds([id]).mergeMap(httpUsers => {
      return this.getUserWithFriends(httpUsers[0]);
    });
  }

  friend(sender: IUser, accepter: IUser): Observable<any> {
    return this.httpService.getUsersByIds([sender.id, accepter.id]).flatMap(httpUsers => {
      let httpSender = httpUsers[0];
      let httpAccepter = httpUsers[1];
      httpSender.friendRequests = httpSender.friendRequests.filter(req => req !== httpAccepter.id);
      httpSender.friendIds.push(httpAccepter.id);
      httpAccepter.friendIds.push(httpSender.id);
      return this.updateUsersWithFriends([sender, accepter], [httpSender, httpAccepter]);
    });
  }

  unfriend(user1: IUser, user2: IUser): Observable<any> {
    return this.httpService.getUsersByIds([user1.id, user2.id]).flatMap(httpUsers => {
      let httpUser1 = httpUsers[0];
      let httpUser2 = httpUsers[1];
      httpUser1.friendIds = httpUser1.friendIds.filter(friendId => friendId !== httpUser2.id);
      httpUser2.friendIds = httpUser2.friendIds.filter(friendId => friendId !== httpUser1.id);
      return this.updateUsersWithFriends([user1, user2], [httpUser1, httpUser2]);
    });
  }

  request(from: IUser, to: IUser): Observable<any> {
    return this.httpService.getUsersByIds([from.id]).flatMap(httpUsers => {
      let httpFrom = httpUsers[0];
      if (httpFrom.friendRequests) {
        httpFrom.friendRequests.push(to.id);
      } else {
        httpFrom.friendRequests = [];
      }
      return this.updateUsersWithFriends([from], [httpFrom]);
    });
  }

  unrequest(from: IUser, to: IUser): Observable<any> {
    return this.httpService.getUsersByIds([from.id]).flatMap(httpUsers => {
      let httpFrom = httpUsers[0];
      httpFrom.friendRequests = httpFrom.friendRequests.filter(request => request !== to.id);
      return this.updateUsersWithFriends([from], [httpFrom]);
    });
  }

  private updateUsersWithFriends(users: IUser[], httpUsers: IHttpUser[]): Observable<any> {
    return Observable.forkJoin(httpUsers.map((httpUser, index) => {
      return this.httpService.putUser(httpUser).map(httpUpdatedUser => {
        this.getUserWithFriends(httpUpdatedUser).subscribe(updatedUser => {
          users[index].requests = updatedUser.requests;
          users[index].friends = updatedUser.friends;
        });
      });
    }));
  }

  private getUserWithFriends(httpUser: IHttpUser): Observable<IUser> {
    let user = this.getTranslatedUsers([httpUser])[0];
    return this.httpService.getUsersByIds(httpUser.friendIds.concat(httpUser.friendRequests)).map(httpOthers => {
      user.friends = this.getTranslatedUsers(this.getHttpFriends(httpUser, httpOthers));
      user.requests = this.getTranslatedUsers(this.getHttpFriendRequests(httpUser, httpOthers));
      return user;
    });
  }

  private getUserWithFriendsUsingFriends(httpUser: IHttpUser, httpFriends: IHttpUser[], httpFriendRequests: IHttpUser[]): IUser {
    let user = this.translateUser(httpUser);
    user.friends = httpFriends.map(httpFriend => this.translateUser(httpFriend));
    user.requests = httpFriendRequests.map(httpFriendRequest => this.translateUser(httpFriendRequest));
    return user;
  }

  private translateUser(httpUser: IHttpUser): IUser {
    return <IUser>{
      id: httpUser.id,
      userName: httpUser.userName,
      password: httpUser.password,
      fullName: httpUser.fullName,
      pic: httpUser.pic
    };
  }

  private getHttpFriends(httpUser: IHttpUser, httpOthers: IHttpUser[]): IHttpUser[] {
    return httpUser.friendIds ? httpOthers.filter(httpOther => httpUser.friendIds.some(friendId => friendId == httpOther.id)) : [];
  }

  private getHttpFriendRequests(httpUser: IHttpUser, httpOthers: IHttpUser[]): IHttpUser[] {
    return httpUser.friendRequests ? httpOthers.filter(httpOther => httpUser.friendRequests.some(friendRequest => friendRequest == httpOther.id)) : [];
  }

  private getTranslatedUsers(httpUsers: IHttpUser[]): IUser[] {
    return httpUsers.map(httpUser => {
      this.updateCachedUsers(httpUser);
      return this.translateUser(httpUser);
    });
  }

  private updateCachedUsers(httpUser: IHttpUser): void {
    this.cachedHttpUsers = this.cachedHttpUsers.filter(cachedHttpUser => cachedHttpUser.id !== httpUser.id);
    this.cachedHttpUsers.push(httpUser);
    this.cachedBaseUsers = this.cachedBaseUsers.filter(cachedBaseUser => cachedBaseUser.id !== httpUser.id);
    this.cachedBaseUsers.push(this.translateUser(httpUser));
  }
}
