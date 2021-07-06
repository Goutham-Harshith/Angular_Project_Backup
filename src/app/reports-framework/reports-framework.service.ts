import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Global } from 'src/Global';

@Injectable({
  providedIn: 'root'
})
export class ReportsDashboardService {

  constructor(private httpClient: HttpClient) { }

  fetchReport(pageCode :string, reportCode: string, chartName: string) {
    pageCode = encodeURI(pageCode);
    reportCode = encodeURI(reportCode);
    chartName = encodeURIComponent(chartName);
    var finalUrl = Global.BASE_PATH_VIZ_FW + "/charts/" + pageCode + "/" + reportCode 
    + "?chartName=" + chartName;
    return this.httpClient.post(finalUrl, {});
  }

  getFilterData2(entityType :string, pageCode : string, reportCode :string, name :string, body :{}) {
    var entityFieldName;
    switch (entityType) {
      case "filters":
        entityFieldName = "filterName";
        break;
      case "cards" :
        entityFieldName = "cardName";
        break;
      case "charts" :
        entityFieldName = "chartName";
        break;
      case"tabularData":
        entityFieldName = "name";
        break;
      default :
        return;
    }
    var endPoint = Global.BASE_PATH_VIZ_FW + "/" + entityType + "/" + encodeURI(pageCode) + "/" + encodeURI(reportCode) + "?"+entityFieldName+"="+ encodeURIComponent(name);
    console.log("final uri is ", endPoint);
    return this.httpClient.post(endPoint,body);
  }

  getElementsByReportCode(pageCode, reportCode)
  {
      return this.httpClient.get(Global.BASE_PATH_VIZ_FW + "/" + pageCode + "/" + reportCode);
  }

}
