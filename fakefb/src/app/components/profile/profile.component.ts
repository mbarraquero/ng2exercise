import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService, ProfileService } from '../../services';
import { IUser, IPost } from '../../models';

type ViewType = "Posts" | "Friends" | "Make Friends";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ProfileService]
})
export class ProfileComponent implements OnInit {

  user: IUser;
  view: ViewType;
  viewOptions: ViewType[];
  loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.route.params.subscribe(params => {
      this.profileService.getUser(+params['id']).subscribe(user => {
        this.user = user;
        if (this.isMyProfile) {
          this.viewOptions = ["Posts", "Friends", "Make Friends"];
        } else {
          this.viewOptions = ["Posts", "Friends"];
        }
        this.view = "Posts";
        this.loading = false;
      });
    });
  }

  selectView(view: ViewType): void {
    this.view = view;
  }

  get me(): IUser {
    return this.sessionService.user;
  }

  get notMyFriends(): IUser[] {
    return this.profileService.getNotFriends(this.me);
  }

  get isMyProfile(): boolean {
    return this.user.id === this.me.id;
  }

  get isFriend(): boolean {
    return !this.isMyProfile && this.me.friends && this.me.friends.some(myFriend => myFriend.id === this.user.id);
  }

  get requestSent(): boolean {
    return !this.isMyProfile && !this.isFriend && this.me.requests && this.me.requests.some(myRequest => myRequest.id === this.user.id);
  }

  get requestReceived(): boolean {
    return !this.isMyProfile && !this.isFriend && this.user.requests && this.user.requests.some(itsRequest => itsRequest.id === this.me.id);
  }

  get notFriends(): boolean {
    return !this.isMyProfile && !this.isFriend && !this.requestSent && !this.requestReceived;
  }

  sendFriendRequest(): void {
    this.profileService.sendRequest(this.me, this.user);
  }

  cancelRequest(): void {
    this.profileService.cancelRequest(this.me, this.user);
  }

  approveRequest(): void {
    this.profileService.approveRequest(this.me, this.user);
  }

  rejectRequest(): void {
    this.profileService.rejectRequest(this.me, this.user);
  }

  unfriend(): void {
    this.profileService.unfriend(this.me, this.user);
  }
}
