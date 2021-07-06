import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from '../../Global';

@Injectable({
  providedIn: 'root'
})
export class DashboardserviceService {
  token: string

  constructor(private httpClient: HttpClient) { }
  
  getJobsList() {
    return this.httpClient.get(Global.JOBS_LIST_URL);
  }

  executeJob(body) {
    return  this.httpClient.post(Global.EXECUTE_URL, body);
  }

  getSources(){
   return this.httpClient.get(Global.GET_SOURCES_URL);
  }

  getJobLogs(jobId){
    return this.httpClient.get(Global.GET_JOB_LOGS +'/'+ jobId);
  }

  getjobExStatusCount()
  {
    return this.httpClient.get(Global.GET_JOB_STATUS_COUNT);
  }

  getJobStatus(jobId)
  {
    return this.httpClient.get(Global.GET_JOB_STATUS +'/'+ jobId);
  }

  setFileReRunParams(loadType: string, lineageId: number, file?: File): Observable<any> {
    var formData : FormData = new FormData();
    formData.append("lineageId", lineageId.toString());
    formData.append("loadType", loadType);
    if(file) {
      formData.append("file", file);
    }
    return this.httpClient.post(Global.SAVE_RERUN_PARAMS, formData);
  }
  
  setRdbmsRerunParams(body :any)
  {
    var formData : FormData = new FormData();
    for(let key of Object.keys(body)) {
      formData.append(key, body[key]);
    }
    return this.httpClient.post(Global.RDBMS_SAVE_RERUN_PARAMS, formData);
  }

  fetchSavedColumns(lineageID)
  {
    return this.httpClient.get(Global.FETCH_SAVED_COLUMNS + "/" +lineageID); 
  }

  fetchTimeline()
  {
    return this.httpClient.get(Global.FETCH_TIMELINE);
  }

  fetchTimelineOnScrollDown(lastId : number)
  {
    return this.httpClient.get(Global.FETCH_TIMELINE + "/" + lastId);
  }

}
