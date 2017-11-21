import { Component, OnInit, Input } from '@angular/core';
import { ProfileService } from '../../services';
import { IUser } from '../../models';

@Component({
  selector: 'app-profile-friends',
  templateUrl: './profile-friends.component.html',
  styleUrls: ['./profile-friends.component.css'],
  providers: [ProfileService]
})
export class ProfileFriendsComponent implements OnInit {

  @Input() user: IUser;
  @Input() friends: IUser[];
  @Input() placeholder: string;
  search: string;

  constructor(
    private profileService: ProfileService
  ) { }

  ngOnInit() {
  }
  
  viewProfile(friend: IUser): void {
    this.profileService.viewProfile(friend.id);
  }

}
