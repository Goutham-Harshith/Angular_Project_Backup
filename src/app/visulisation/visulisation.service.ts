import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Global } from 'src/Global';

@Injectable({
  providedIn: 'root'
})
export class VisulisationService {

  constructor(private HttpClient: HttpClient) { }

  fetchTables(filter) {
    return this.HttpClient.get(Global.VIZ_TBL_LIST+ "/" + filter)
  }
  stagingColumns(tname: string, nodeTypeId: string) {
    let body = { "tbl": tname, "nodeTypeId": nodeTypeId }
    return this.HttpClient.post(Global.VIZ_COL_LIST, body)
  }
  getChartDetails(tname: string, nodeTypeId: string, xcolumn: any, ycolumn: any, chartType: any, aggeType: any) {
    let body = { "tname": tname, "tlevel": nodeTypeId, "xColumn": xcolumn, "yColumn": ycolumn, "chartType": chartType, "aggType": aggeType }
    return this.HttpClient.post(Global.VIZ_CHARTS, body)
  }

}
