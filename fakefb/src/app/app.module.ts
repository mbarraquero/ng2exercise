import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { appRoutes } from './route.config';
import { AuthGuard } from './guards/auth-guard.service';
import { SessionService, UserService, HttpService } from './services';
import {
  AppComponent,
  LoginComponent,
  FeedsComponent,
  PostComponent,
  NewPostComponent,
  ProfileComponent,
  ProfileFeedComponent,
  ProfileFriendsComponent,
  SessionComponent
} from './components';
import {
  FilterByPipe,
  SortByPipe
} from './pipes';
import { OnEnterDirective } from './directives';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FeedsComponent,
    PostComponent,
    ProfileComponent,
    SessionComponent,
    NewPostComponent,
    SortByPipe,
    ProfileFeedComponent,
    ProfileFriendsComponent,
    FilterByPipe,
    OnEnterDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes, {
        //enableTracing: true
      }
    )
  ],
  providers: [
    SessionService,
    UserService,
    HttpService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
