import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from 'node_modules/rxjs';
import { timer } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { catchError, delay, filter, finalize, switchMap, take } from 'rxjs/operators';
import { Global } from 'src/Global';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router'
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

// @Injectable()
// export class LoaderService {
//     isLoading = new BehaviorSubject<boolean>(false);
//     show() {
//         this.isLoading.next(true);
//     }
//     hide() {
//         this.isLoading.next(false);
//     }
//     getStatus(){
//       return this.isLoading.asObservable();
//     }
// }

@Injectable()
export class Interceptor implements HttpInterceptor {

  constructor(@Inject(CookieService) private CookieService: CookieService, private httpClient: HttpClient, private toastr: ToastrService, private router: Router) { }

  refToken: string = this.CookieService.get('refToken');
  refreshFlag : boolean = false

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let token: string = this.CookieService.get('authToken');
    if ((token != null) && (token !== "")) {
      if (request.headers.get('Authorization') == null) {
        let AuthRequest = this.addToken(request);
        return next.handle(AuthRequest).pipe(
          catchError(error => {
            console.log(error);
            if (error.status === 401) {
              if (!this.refreshFlag) {
                this.refreshFlag= true;
                return this.fetchToken(request, next)
              }
              else {
                // TODO here we need to come up with solution which is independant of mannual delay.
                return timer(1000).pipe(switchMap(() => {
                  this.refreshFlag= false;
                  return next.handle(this.addToken(request));
                }))
              }
            }
            else {
              return throwError(error);
            }

          })
        )
      }
      else return next.handle(request)
    }
    else {
      return next.handle(request).pipe(
        //   finalize(()=>this.loaderService.hide())
      );
    }
  }

  addToken(request: HttpRequest<any>) {
    var request2: HttpRequest<any>;
    let token = this.CookieService.get('authToken');
    var headerCheck = ["fileDataTypesFinder", "FilePreviewController", "uploadFile", "saveRerunParams", "AddFile", "jobCreationUsingExcel"];
    var check = headerCheck.some(el => request.url.includes(el));
    if (check) {
      var headers = new HttpHeaders().append('Authorization', token).append('responseType', 'text');
    }
    else {
      var headers = new HttpHeaders().append('Authorization', token).append('Content-Type', 'application/json');
    }
    request2 = request.clone({ headers: headers });
    return request2;
  }

  fetchToken(request: HttpRequest<any>, next: HttpHandler) {
    const body = new HttpParams().set('grant_type', 'refresh_token').set('refresh_token', this.getRefToken());
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': "application/x-www-form-urlencoded",
        'Authorization': "Basic " + btoa("DimeClientId:secret"),
      })
    }
    let response;
    return this.httpClient.post(Global.TOKEN_URL, body, httpOptions).pipe(
      switchMap((Res) => {
        response = Res
        console.log(response)
        this.setAccessToken(response)
        return timer(500).pipe(switchMap(() => {
          return next.handle(this.addToken(request));
        }))
      }),
      catchError(error => {
        console.log(error);
        if (error.status == 400) {
          this.toastr.error("Invalid refresh token")
          this.CookieService.deleteAll('/wdasv2');
          this.router.navigate(['/login'])
        }
        else if (error.status == 401) {
          this.toastr.error("Session expired ! Please login again");
          this.CookieService.deleteAll('/wdasv2');
          this.router.navigate(['/login'])
        }
        return throwError(error)
      }))
  }

  getRefToken() {
    return this.CookieService.get('refToken');
  }
  getAccessToken() {
    return this.CookieService.get('authToken');
  }

  setAccessToken(res: any) {
    this.CookieService.set('authToken', res["token_type"] + " " + res["access_token"]);
  }

}