import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from '../../Global';
@Injectable({
  providedIn: 'root'
})
export class LargeDataIngestionService {
  constructor(private httpClient: HttpClient) { }
  token: String;

  fetchFiles(body): Observable<any> {
    return this.httpClient.post(Global.LARGE_FILE_LIST, body);
  }

  sendFilestoBeCopiedToHDFS(body) {
    return this.httpClient.post(Global.COPY_HDFS_URL, body);
  }

  getJobsList(): Observable<any> {
    var headers_object = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + this.token
    });
    const httpOptions = {
      headers: headers_object
    };
    return this.httpClient.get(Global.JOBS_LIST_URL, httpOptions);
  }
}
