import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from 'src/Global';

@Injectable({
  providedIn: 'root'
})
export class RdbmsDataIngestionService {

  constructor(private httpClient: HttpClient) { }
  fetchTablesList(formValue: any): Observable<Response> {
    let body = JSON.stringify(formValue);
    return this.httpClient.post<Response>(Global.TABLES_LIST_URL, body);
  }
  fetchSchemaList(formValue: any): Observable<any> {
    let body = JSON.stringify(formValue);
    return this.httpClient.post(Global.SCHEMAS_LIST_URL, body);
  }

  fetchColumnsList(formValue: any): Observable<any> {
    let body = JSON.stringify(formValue);
    return this.httpClient.post(Global.COLUMNS_LIST_URL, body);
  }
  createJob(body: any): Observable<any> {
    console.log("body of rdbms job ", body);
    // return;
    return this.httpClient.post(Global.JOBS_CREATE_URL, body, { responseType: 'text' });
  }
  
  jobCreationUsingExcel(fileToUpload,dbPort,dbName,dbUrl,driverClass,dbUser,dbPassword,type)
  {
    var formData: FormData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("dbPort", dbPort);
    formData.append("dbName", dbName);
    formData.append("dbUrl",dbUrl );
    formData.append("driverClass", driverClass);
    formData.append("dbUser", dbUser);
    formData.append("dbPassword", dbPassword);
    formData.append("type", type);
    return this.httpClient.post(Global.JOB_CREATION_USING_FILE_UPLOAD , formData);
  }
}
