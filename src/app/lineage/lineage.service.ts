import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from 'src/Global';
@Injectable({
  providedIn: 'root'
})
export class LineageService {

  constructor(private httpClient: HttpClient) { }

  fetchLineage(flowId): Observable<any> {
    let body = {"flowId": flowId };
    return this.httpClient.post(Global.FETCH_LINEAGE_JSON_URL, body);
}
fetchWrangle(reqBody):Observable<any>{
  return this.httpClient.post(Global.BASE_PATH_TRANSFORM+"/previewWrangledData",reqBody);
}

fetchWrangleTables(nodeTypeId){
  return this.httpClient.post(Global.BASE_PATH_TRANSFORM + "/quickWranglingTbls", { 'nodeTypeId': nodeTypeId });
}
createWrangledTable(reqbody){
  return this.httpClient.post(Global.BASE_PATH_TRANSFORM+"/createWrangledTbl",reqbody)
}
fetchColumns(tname,nodeTypeId){
  let body = { "tbl": tname, "nodeTypeId": nodeTypeId }
  return this.httpClient.post(Global.VIZ_COL_LIST, body)
}
}
