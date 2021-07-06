import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from '../../Global';
@Injectable({
  providedIn: 'root'
})
export class DataIngestionService {
  constructor(private httpClient: HttpClient) { }
  uploadCSV(fileToUpload: File, fileName: string, fieldDelimiter: string): Observable<any> {
    var formData: FormData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("fileName", fileName);
    formData.append("fieldDelimiter", fieldDelimiter);
    return this.httpClient.post(Global.DATA_TYPE_FINDER, formData);
  }

  createCSVJob(tableName: string, columns: any, comments: string, targetNodeTypeId: any, fileName: string, newFileName: string, fieldDelimiter: string, quoteCharacter: string, escapeCharacter: string, jobName: string, flowId?: any): Observable<any> {
    var formData: FormData = new FormData();
    formData.append("tableName", tableName);
    formData.append("jsonString", columns);
    formData.append("comments", comments);
    formData.append("trgNodeTypeId",targetNodeTypeId );
    formData.append("fileName", fileName);
    formData.append("newFileName", newFileName);
    formData.append("fieldDelimiter", fieldDelimiter);
    formData.append("quoteCharacter", quoteCharacter);
    formData.append("escapeCharacter", escapeCharacter);
    formData.append("srcNodeTypeId","1" );
    if (flowId) {
      formData.append("flowId ", flowId);
    }
    else{
      formData.append("jobName", jobName);
    }
    return this.httpClient.post(Global.CREATE_CSV_JOB_URL, formData);
  }

  previewFile(fileName: string, fieldDelimiter: string, quoteCharacter: string) {
    var formData: FormData = new FormData();
    formData.append("fileName", fileName);
    formData.append("fieldDelimiter", fieldDelimiter);
    formData.append("quoteCharacter", quoteCharacter);
    return this.httpClient.post(Global.FILE_PREVIEW_URL, formData);
  }

  validateTableName(body : any)
  {
    return this.httpClient.post(Global.VALIDATE_TABLE , body);
  }

  validateProjectName(projetName : string)
  {
    return this.httpClient.get(Global.VALIDATE_PROJECT + "/" + projetName);
  }
}

