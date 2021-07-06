import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) { }

  get isLoggedIn() {
      return this.loggedIn.asObservable();
  }

  logout() {
      this.loggedIn.next(false);
  }
  
  }

  

