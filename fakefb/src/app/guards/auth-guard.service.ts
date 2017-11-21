import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { SessionService } from '../services/session.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private sessionService: SessionService,
    private router: Router
  ) {}

  canActivate() {
    if (this.sessionService.loggedIn) return true;
    this.router.navigate(['/error']);
  }
}