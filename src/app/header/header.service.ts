import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { Global } from 'src/Global'

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor(private httpClient: HttpClient) { }

  deleteToken(authToken): Observable<any> {
    const httpHeaders = new HttpHeaders().append('x-requested-with', authToken).append('Authorization', "Basic " + btoa("DimeClientId:secret"));
    const httpOptions = { headers: httpHeaders }
    return this.httpClient.delete(Global.TOKEN_URL, httpOptions);
  }

  getPageReportsDetails()
  {
    return this.httpClient.get(Global.BASE_PATH_VIZ_FW + "/pageReportDetails");
  }
}
