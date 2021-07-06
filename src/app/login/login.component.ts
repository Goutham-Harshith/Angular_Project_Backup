import { Component, OnInit, Inject } from '@angular/core';
import { LoginService } from './login.service'
import { CookieService } from 'ngx-cookie-service'
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  userName: string;
  userPwd: string;
  status: string;
  message: string;
  isError = false;
  changingPwd: boolean;
  newPassword: any;
  confirmPassword: any;
  checkPwd: boolean;
  passwordData: string;
  pwdTextType : boolean = false;

  constructor(private LoginService: LoginService, private router: Router, @Inject(CookieService) private CookieService: CookieService) { 
    if(this.CookieService.get("islogged"))
    {
      router.navigate(['dashboard']);
    }
  }

  ngOnInit() {
  }

  login() {
    this.LoginService.login(this.userName.toLowerCase(), this.userPwd).subscribe(Response => {
      this.CookieService.deleteAll('/wdasv2');
      this.CookieService.set("islogged", "true")
      this.CookieService.set('authToken', Response.token_type + " " + Response.access_token);
      this.CookieService.set('refToken', Response.refresh_token);
      this.CookieService.set("username", this.userName.toLowerCase());
      this.LoginService.getUserStatus(this.userName).subscribe(Response => {
        if (Response.response == "Registered") {
          this.changingPwd = true;
          this.newPassword = "";
          this.confirmPassword = "";
          this.passwordData = "";
        }
        else if (Response.response == "active") {
          this.changingPwd = false;
          this.isError = true;
          this.status = "Success";
          this.message = "User login successfully";
          this.router.navigateByUrl("/dashboard");
          setTimeout(() => {
            this.isError = false;
          }, 3000);
        }
      })
    }, error => {
      this.isError = true;
      if (error.status == 400) {
        this.status = "Failure";
        if(error.error.error_description == "Bad credentials") this.message = "wrong username/password";
        else this.message = error.error.error_description;
      } else {
        this.status = "Warning";
        this.message = "Something went wrong";
      }
      setTimeout(() => {
        this.isError = false;
      }, 3000);
    })
  }

  checkPassword() {
    if (this.newPassword == this.confirmPassword) {
      this.checkPwd = true;
      this.passwordData = "Matching"
    }
    else {
      this.checkPwd = false;
      this.passwordData = "Not matching"
    }
  }

  changeDetails() {
    this.LoginService.getChangeDetails(this.userName, this.newPassword, this.CookieService.get("authToken")).subscribe(Response => {
      this.changingPwd = false
      this.userName = "";
      this.userPwd = "";
      this.isError = true;
      this.status = "Success";
      this.message = "Password changed successfully !";
      this.CookieService.deleteAll('/wdasv2');
      setTimeout(() => {
        this.isError = false;
      }, 3000);
    }, error => {
      this.isError = true;
      if (error.status == 400) {
        this.status = "Failure";
        this.message = "Unable to change password"
      } else {
        this.status = "Warning";
        this.message = "Something went wrong";
      }
      setTimeout(() => {
        this.isError = false;
      }, 3000);
    })
  }

  toggleFieldTextType()
  {
      this.pwdTextType = !this.pwdTextType
  }

}
