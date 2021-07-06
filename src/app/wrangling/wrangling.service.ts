import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Global } from 'src/Global';


@Injectable({
  providedIn: 'root'
})
export class WranglingService {

  constructor(private httpClient :HttpClient) { }
  /**
   * getMetaDataService
   */
  public getMetaDataService(body) {
   console.log("body is",body)
    return this.httpClient.post<Response>(Global.METADATA_URL,body)
  }

  /**
   * getPreviewDataService
   */
  public getPreviewDataService(body) {
    
    console.log("getting preview data",body)
    return this.httpClient.post<Response>(Global.PREVIEW_URL,body)
  }

  public findNadReplace(body){
    
    return this.httpClient.post<Response>(Global.FIND_AND_REPLACE_END_POINT,body)
  }
  public filterByDate(body){
    return this.httpClient.post<Response>(Global.DATE_AND_FILTER_END_POINT,body)
  }
  public filteBynumber(body){
    return this.httpClient.post<Response>(Global.NUMBER_FILTER_END_POINT,body)
  }
  public scaling(body){
    return this.httpClient.post<Response>(Global.CONCAT_COLUMNS_END_POINT,body)
  }
  public concatColumns(body){
    return this.httpClient.post<Response>(Global.CONCAT_COLUMNS_END_POINT,body)
  }

  public folderPreview(nodeId: number, nodeTypeId: number) {
    const body = {"nodeId": nodeId, "nodeTypeId": nodeTypeId};
    return this.httpClient.post<Response>(Global.FOLDER_PREVIEW_END_POINT, body);
  }

  public filePreview(filePath: string, nodeTypeId: number) {
    const body = {"filePath": filePath, "nodeTypeId": nodeTypeId};
    return this.httpClient.post<Response>(Global.FILE_PREVIEW_END_POINT, body);
  }
}
