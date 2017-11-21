import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { IUser } from '../models';

@Injectable()
export class ProfileService {

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  viewProfile(userId: number): void {
    this.router.navigate([`profile/${userId}`]);
  }

  getUser(id: number): Observable<IUser> {
    return this.userService.getUser(id);
  }

  getNotFriends(user: IUser): IUser[] {
    return this.userService.cachedBaseUsers.filter(baseUser =>
      !user.friends.some(friend => friend.id === baseUser.id) &&
      user.id !== baseUser.id);
  }

  sendRequest(me: IUser, other: IUser): void {
    this.userService.request(me, other).subscribe(() => {});
  }  

  approveRequest(me: IUser, other: IUser): void {
    this.userService.friend(other, me).subscribe(() => {});
  }

  unfriend(me: IUser, other: IUser): void {
    this.userService.unfriend(me, other).subscribe(() => {});
  }

  rejectRequest(me: IUser, other: IUser): void {
    this.userService.unrequest(other, me).subscribe(() => {});
  }

  cancelRequest(me: IUser, other: IUser): void {
    this.userService.unrequest(me, other).subscribe(() => {});
  }
}
