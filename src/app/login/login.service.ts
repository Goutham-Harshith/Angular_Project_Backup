import { Injectable } from '@angular/core';
import { Global } from 'src/Global'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { from, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  login(UserName: any, Password: any): Observable<any> {
    const body = new HttpParams().set('grant_type', 'password').set('username', UserName).set('password', Password)
    const httpoptions = {
      headers: new HttpHeaders({
        'content-Type': "application/x-www-form-urlencoded",
        'Authorization': "Basic " + btoa("WdasClientId:secret")
      })
    }
    return this.httpClient.post(Global.TOKEN_URL, body, httpoptions)
  }

  getUserStatus(UserName: any): Observable<any> {
    let body = { "userName": UserName };
    return this.httpClient.post(Global.USER_STATUS_URL, body);
  }

  getChangeDetails(userName: any, changePwd: any, token) {
    const body = new HttpParams().set('userName', userName).set('newPd', changePwd);
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': token
      })
    }
    return this.httpClient.post(Global.CHANGE_PWD_URL, body, httpOptions);
  }

}
