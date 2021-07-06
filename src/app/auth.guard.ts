
import { Injectable,Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';
@Injectable()
export class AuthGuardGuard implements CanActivate {

    //private cookieService : CookieService
    constructor(private router: Router, private authService: AuthService,@Inject(CookieService)private CookieService:CookieService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.CookieService.get("islogged")) {
            var prevLoc = this.router.url;
            this.authService.loggedIn.next(true);
            console.log("activating auth guard")
            return true;
        }
        else {
            console.log("deactivating ")
            this.router.navigate(['/login']);
            this.authService.loggedIn.next(false);
            return false;
        }

    }
}