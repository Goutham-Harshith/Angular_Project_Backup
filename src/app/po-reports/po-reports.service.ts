import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Global } from 'src/Global';

@Injectable({
  providedIn: 'root'
})
export class PoReportService {

  constructor(private httpClient: HttpClient) { }

  fetchReport(pageCode :string, reportCode: string, chartName: string) {
    pageCode = encodeURI(pageCode);
    reportCode = encodeURI(reportCode);
    chartName = encodeURIComponent(chartName);
    var finalUrl = Global.BASE_PATH_VIZ_FW + "/charts/" + pageCode + "/" + reportCode 
    + "?chartName=" + chartName;
    return this.httpClient.post(finalUrl, {});
  }

}
