import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionService, PostsService } from '../../services';
import { IUser, IPost } from '../../models';

@Component({
  selector: 'app-profile-feed',
  templateUrl: './profile-feed.component.html',
  styleUrls: ['./profile-feed.component.css'],
  providers: [PostsService]
})
export class ProfileFeedComponent implements OnInit {

  @Input() user: IUser;
  posts$: Observable<IPost[]>;

  constructor(
    private sessionService: SessionService,
    private postsService: PostsService
  ) { }

  ngOnInit() {
    this.setupPosts();
  }

  setupPosts(): void {
    this.posts$ = this.postsService.getPosts([this.user.id]);
  }

  get isMyProfile(): boolean {
    return this.user.id === this.sessionService.user.id;
  }
}
