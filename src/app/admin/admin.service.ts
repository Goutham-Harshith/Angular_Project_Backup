import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Global } from 'src/Global';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private httpClient: HttpClient) { }

  listUsers()
  {
    return this.httpClient.get(Global.LIST_USER_URL);
  }

  createUsers(body:any)
  {
    return this.httpClient.post(Global.CREATE_USER_URL,body)
  }
  
  checkUserName(body)
  {
    return this.httpClient.post(Global.SEARCH_USER_URL,body);
  }

  deleteUser(body)
  {
    return this.httpClient.post(Global.DELETE_USER_URL,body)
  }

  resetPassword(body)
  {
      return this.httpClient.post(Global.RESET_PASSWORD_URL,body)
  }
}
