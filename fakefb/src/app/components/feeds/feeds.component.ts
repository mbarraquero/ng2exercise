import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionService, PostsService } from '../../services';
import { IPost } from '../../models';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.css'],
  providers: [PostsService]
})
export class FeedsComponent implements OnInit {

  posts$: Observable<IPost[]>;

  constructor(
    private sessionService: SessionService,
    private postsService: PostsService
  ) { }

  ngOnInit() {
    this.setupPosts();
  }

  setupPosts(): void {
    let userAndFriendsIds = [this.sessionService.user.id].concat(this.sessionService.user.friends.map(friend => friend.id));
    this.posts$ = this.postsService.getPosts(userAndFriendsIds);
  }
}
