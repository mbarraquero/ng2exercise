import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SessionService, PostsService } from '../../services';
import { IUser, IPost, PostType } from '../../models';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
  providers: [PostsService]
})
export class NewPostComponent implements OnInit {

  @Input() parent?: IPost;
  @Input() type: PostType;
  @Output() onNewPost: EventEmitter<any> = new EventEmitter<any>();

  post: IPost;
  loading: boolean;

  constructor(
    private sessionService: SessionService,
    private postsService: PostsService
  ) { }

  ngOnInit() {
    this.post = this.newPost;
  }

  private get newPost(): IPost {
    return <IPost>{
      user: this.sessionService.user,
      type: this.type,
      content: ""
    };
  }

  get isMain(): boolean {
    return this.type === "main";
  }

  savePost = (): void => {
    this.loading = true;
    this.post.date = new Date();
    if (this.isMain) {
      this.postsService.savePost(this.post).subscribe(() => this.onSave());
    } else {
      this.postsService.saveReply(this.parent, this.post).subscribe(reply => {
        this.parent.replies.push(reply);
        this.onSave();
      });
    }
  }

  private onSave(): void {
    this.onNewPost.emit();
    this.post = this.newPost;
    this.loading = false;
  }

  get picSize(): number {
    return this.isMain ? 64 : 32;
  }

  get postButtonText(): string {
    return this.isMain ? "Post" : "Reply";
  }

}
