import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-page-left-cont',
  templateUrl: './page-left-cont.component.html',
  styleUrls: ['./page-left-cont.component.css'],

})
export class PageLeftContComponent implements OnInit {
public pageTitle:any='';
 flowId: number;
 projectName : string;
  constructor(private activatedroute : ActivatedRoute, private route : Router) { }

  ngOnInit() {

    this.activatedroute.queryParamMap.subscribe(res =>
      {
        this.flowId = res['params'].flowId
        this.projectName = res['params'].project
      })
      
    if(this.route.url.indexOf("/data-connection") !== -1){
      this.pageTitle ='Data Connection';
    }
    if(this.route.url.indexOf("/data-ingestion") !== -1){
      this.pageTitle ='Data Ingestion';
      document.getElementById("data-ingestion").classList.add("active");
    }
    if(this.route.url.indexOf("/data-stream-ingestion") !== -1){
      this.pageTitle ='Data Stream Ingestion';
      document.getElementById("data-stream-ingestion").classList.add("active");
    }
    if(this.route.url.indexOf("/large-data-ingestion") !== -1 ){
      this.pageTitle ='Large Data Ingestions';
      document.getElementById("large-data-Ingestion").classList.add("active");
    }
    if(this.route.url.indexOf("/rdbms-data-ingestion") !== -1){
      this.pageTitle ='RDBMS-Data Ingestion';
      document.getElementById("rdbms-data-ingestion").classList.add("active");
    }
   
  }

  public setTitle(x, route)
  {
   this.pageTitle = x;
   if(this.flowId)
   {
     this.route.navigate([route], { queryParams: { flowId: this.flowId, project : this.projectName} })
   }
   else{
      this.route.navigate([route]);
   }
  }


}
