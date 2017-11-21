import { Component, OnInit } from '@angular/core';
import { SessionService, ProfileService } from '../../services';
import { IUser } from '../../models';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css'],
  providers: [ProfileService]
})
export class SessionComponent implements OnInit {

  constructor(
    private sessionService: SessionService,
    private profileService: ProfileService
  ) { }

  ngOnInit() {
  }

  get user(): IUser {
    return this.sessionService.user;
  }

  viewProfile(): void {
    this.profileService.viewProfile(this.sessionService.user.id);
  }

  viewFeed(): void {
    this.sessionService.viewFeed();
  }

  logout(): void {
    this.sessionService.signOut();
  }
}
