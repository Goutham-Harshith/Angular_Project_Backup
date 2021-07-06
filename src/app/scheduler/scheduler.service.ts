import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Global } from 'src/Global';


@Injectable({
  providedIn: 'root'
})
export class SchedulerService {

  constructor(private httpClient :HttpClient) { }
  submitScheduler(body):Observable<any>{
   return this.httpClient.post<Response>(Global.SCHEDULER,body)
  }

  getSchedularWorkflows(body):Observable<any>{
    return this.httpClient.post<Response>(Global.JOBS_LIST_URL, body);
  }

  getScheduleJobs() :Observable<any>{
    return this.httpClient.get(Global.COORD_LIST_URL);
  }

  scheduleJobOptions(body) :Observable<any>{
    return this.httpClient.post(Global.OOZIEOPTIONS,body);
  }

  suspendScheduler(body)
  {
      return this.httpClient.post(Global.SUSPEND_SCHEDULE, body);
  }

  resumeScheduler(body)
  {
      return this.httpClient.post(Global.RESUME_SCHEDULE, body);
  }

  deleteScheduler(body)
  {
      return this.httpClient.post(Global.DELETE_SCHEDULE, body);
  }

  validateSchedulerName(body)
  {
    return this.httpClient.post(Global.VALIDATE_SCHEDULER_NAME, body);
  }

}
