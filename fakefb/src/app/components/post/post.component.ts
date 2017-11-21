import { Component, OnInit, Input } from '@angular/core';
import { SessionService, ProfileService, PostsService } from '../../services';
import { IPost } from '../../models';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  providers: [ProfileService]
})
export class PostComponent implements OnInit {

  @Input() post: IPost;

  constructor(
    private sessionService: SessionService,
    private profileService: ProfileService,
    private postsService: PostsService
  ) { }

  ngOnInit() {
  }

  get postContent(): string {
    return this.post.content.replace(/\n/g, "<br>");
  }

  get picSize(): number {
    return this.post.type === "main" ? 64 : 32;
  }

  get liked(): boolean {
    return this.post.likes.some(like => like.id === this.sessionService.user.id);
  }

  get likesCount(): number {
    return this.post.likes.length;
  }

  get likesText(): string {
    return this.post.likes.map(like => like.fullName).join("\r\n");
  }

  viewProfile(): void {
    this.profileService.viewProfile(this.post.user.id);
  }

  toggleLike(): void {
    if (this.liked) {
      this.postsService.dislikePost(this.post, this.sessionService.user).subscribe(post => this.post.likes = post.likes);
    } else {
      this.postsService.likePost(this.post, this.sessionService.user).subscribe(post => this.post.likes = post.likes);
    }
  }
}
