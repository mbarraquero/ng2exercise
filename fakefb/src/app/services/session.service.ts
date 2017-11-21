import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { IUser } from '../models';

@Injectable()
export class SessionService {

  user: IUser;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  signIn(username: string, password: string): Observable<boolean> {
    return this.userService.getAllBaseUsers().map(baseUsers => {
      let baseUser = baseUsers.find(user =>
        this.compareString(user.userName, username) &&
        this.compareString(user.password, password));
      if (baseUser) {
        this.userService.getFullUser(baseUser).subscribe(fullUser => {
          this.user = fullUser;
          this.router.navigate(['/feed']);
        });
        return true;
      } else {
        return false;
      }
    });
  }

  private compareString(str1: string, str2: string): boolean {
    return str1.length === str2.length && str1.indexOf(str2) > -1;
  }

  viewFeed(): void {
    this.router.navigate(['/feed']);
  }

  signOut(): void {
    delete this.user;
    this.router.navigate(['/login']);
  }

  get loggedIn(): boolean {
    return !!this.user;
  }
}
