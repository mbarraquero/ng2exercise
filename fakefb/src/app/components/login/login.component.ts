import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  invalid: boolean;

  constructor(
    private sessionService: SessionService
  ) { }

  ngOnInit() {
  }

  signIn(): void {
    if (this.fieldsEntered) this.sessionService.signIn(this.username, this.password).subscribe(success => {
      this.invalid = !success;
      if (this.invalid) this.username = this.password = undefined;
    })
  }

  get fieldsEntered(): boolean {
    return !!this.username && !!this.username.length && !!this.password && !!this.password.length;
  }
}
