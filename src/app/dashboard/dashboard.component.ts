import { Component, OnInit } from '@angular/core';
import { DashboardserviceService } from './dashboardservice.service';
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr';
import { Chart } from 'chart.js';
import $ from 'jquery';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  jobid: any;
  subjobs: boolean;
  jobsList: Array<any>;
  subJobsList: Array<any>;
  flowId: number;
  disable: boolean = true;
  searchJob: string = "";
  psqlSourceCount: number = 0;
  mysqlSourceCount: number = 0;
  fileSourceCount: number = 0;
  hiveSourceCount: number = 0;
  hdfsSourceCount: number = 0;
  folderSourceCount: number = 0;
  pythonRecipesCount: number = 0;
  hqlRecipesCount: number = 0;
  rfModelCount: number = 0;
  rcnnModelCount: number = 0;
  cnnModelCount: number = 0;
  knnModelCount: number = 0;
  logRegModelCount: number = 0;
  nbModelCount: number = 0;
  linRegModelCount: number = 0;
  logsHeading: String;
  logsData: String
  options = {}
  jobExecutionCount: number = 0;
  myPieChart: Chart;
  executeDataCount = { "started": 0, "failed": 0, "success": 0 }
  jobStatus: any;
  rerunParams: FormGroup;
  rdbmsRerunParams: FormGroup;
  rerunFile: File = null;
  rerunFileName = "Drag & Drop files here";
  rdbmsReRunColumns: any;
  status: string = "";
  message: string = "";
  showRdbmsRerunMsg: boolean = false;
  timeLineData = [];
  selector : string = ".main-panel"


  constructor(private dashboardService: DashboardserviceService, private router: Router, private toastr: ToastrService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.subjobs = false;
    this.fetchJobsList();
    this.getSources();
    this.getjobExStatusCount();
    this.fetchTimeline();
    this.options = {
      readOnly: 'nocursor',
      lineWrapping: true,
    };
    this.initFileReRunForm();
    this.initRdbmsRerunForm();
  }

  initFileReRunForm() {
    this.rerunParams = this.fb.group({
      lineageId: ['', Validators.required],
      loadType: ['', Validators.required],
      rerunType: ['', Validators.required],
      nodeTypeId: ['', Validators.required],
    });
  }

  initRdbmsRerunForm() {
    this.rdbmsRerunParams = this.fb.group({
      lineageId: ['', Validators.required],
      loadType: ['TruncateAndLoad', Validators.required],
      selectedIncrementalData: [null, Validators.required]
    });
  }

  // fetching joblist
  fetchJobsList() {
    this.dashboardService.getJobsList().subscribe((Response: any) => {
      if (Response.statusType.toLowerCase() == "info") {
        if (Response.response.length !== 0) {
          this.jobsList = Response.response;
        }
      }
      else if (Response.statusType.toLowerCase() == "error") {
        this.toastr.error(Response.statusMessage);
      }
    }, (error: any) => {
      if (error.error.error == "invalid_grant") {
        return
      }
      this.toastr.error("Something went wrong please try again!!")
    });
  }

  // sub jobs showing
  showSubJobs(subjobsList, id) {
    if (this.subjobs == true) {
      this.subjobs = false;
      this.jobid = id;
      this.disable = true
    } else if (this.subjobs == false) {
      this.flowId = subjobsList[0].flowId
      this.disable = false
      this.subjobs = true;
      this.jobid = id;
      this.subJobsList = subjobsList;
    }
  }

  redirectToLineage(flowId) {
    this.router.navigate(['/lineage'],
      { queryParams: { 'flowId': flowId } })
  }

  execute(mainJobIndex: number, mainJobId: number, isSubJob = false, subJobIndex?: number, subJobId?: number) {
    if (isSubJob) {
      this.jobsList[mainJobIndex].subjobsList[subJobIndex]["exStatus"] = "STARTED";
    } else {
      this.jobsList[mainJobIndex]["exStatus"] = 'STARTED';
      this.jobsList[mainJobIndex].subjobsList.forEach(subJob => {
        subJob["exStatus"] = "STARTED";
      });
    }
    // this.jobsList[index]["exStatus"] = 'STARTED';
    let body = {};
    if (!isSubJob) {
      body = { "jobId": mainJobId };
    } else {
      body = { "lineageId": subJobId };
    }
    this.dashboardService.executeJob(body).subscribe((Response: any) => {
      this.getJobStatus(mainJobIndex, mainJobId);
      if (Response["status"] == 200) {
        let res = JSON.stringify(Response);
        if (res.indexOf("FAILED") !== -1) {
          this.toastr.error("Failed to execute Job ");
        } else {
          this.toastr.success("Job execution started");
        }
      } else {
        this.toastr.error(Response["statusMessage"]);
      }
    }, error => {
      this.toastr.error("Something went wrong ! Please try again.");
    })
  }

  getSources() {
    this.dashboardService.getSources().subscribe((response) => {
      if (response['statusType'].toLowerCase() == "info") {
        let data = response['response'];
        for (let i = 0; i <= data.length - 1; i++) {
          switch (data[i]['nodeTypeId']) {
            case 25:
              this.psqlSourceCount = data[i]['count'];
              break;
            case 30:
              this.mysqlSourceCount = data[i]['count'];
              break;
            case 1:
              this.fileSourceCount = data[i]['count'];
              break;
            case 60:
              this.hiveSourceCount = data[i]['count'];
              break;
            case 3:
              this.hdfsSourceCount = data[i]['count'];
              break;
            case 2:
              this.folderSourceCount = data[i]['count'];
              break;
            case 9:
              this.pythonRecipesCount = data[i]['count'];
            case 13:
              this.hqlRecipesCount = data[i]['count'];
            default:
              break;
          }
        }
      }
      else {
        this.toastr.error(response['statusMessage']);
      }
    }, error => {
      if (error.error.error == "invalid_grant") {
        return
      }
      this.toastr.error("Could not load sources.Please try again!!");
    })
  }

  fetchTimeline() {
    this.dashboardService.fetchTimeline().subscribe((response) => {
      if (response['statusType'].toLowerCase() == "info") {
        this.timeLineData = response['response'];
      }
      else {
        this.toastr.error(response['statusMessage']);
      }
    })
  }

  fetchJobLogs(jobId, jobName) {
    this.logsHeading = jobName;
    this.dashboardService.getJobLogs(jobId).subscribe((Response) => {
      if (Response['status'] == 200) {
        let data = Response['statusMessage'];
        this.logsData = data.trim(' ');
      }

    })
  }
  resetShowLogs() {
    this.logsHeading = "";
    this.logsData = "";
  }

  getjobExStatusCount() {
    this.dashboardService.getjobExStatusCount().subscribe((response) => {
      if (response['statusType'].toLowerCase() == "info") {
        let data = response['response'];
        for (let i = 0; i <= data.length - 1; i++) {
          this.jobExecutionCount = this.jobExecutionCount + data[i]['statusCount'];
          switch (data[i]['status'].toLowerCase()) {
            case "succeeded":
              this.executeDataCount.success = data[i]['statusCount'];
              break;
            case "started":
              this.executeDataCount.started = data[i]['statusCount'];
              break;
            case "failed":
              this.executeDataCount.failed = data[i]['statusCount'];
              break;
            default:
              break;
          }
        }

        var statusCount = [this.executeDataCount.success, this.executeDataCount.started, this.executeDataCount.failed];
        this.createPieChart(statusCount)
      }
      else {
        this.toastr.error(response['statusMessage']);
      }
    }, error => {
      if (error.error.error == "invalid_grant") {
        return
      }
      this.toastr.error("Something went wrong please try again!!")
    })
  }

  createPieChart(count) {
    const canvas = document.getElementById('pieChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    this.myPieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        datasets: [
          {
            data: count,
            backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
            borderWidth: 0
          },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: 'top',
          align: 'center',
        },
        animation: {
          animateScale: true,
          animateRotate: true
        },
        tooltips: {
          enabled: false,
          mode: 'nearest'
        },
      }
    });
    this.myPieChart.canvas.parentNode.style.height = '76px';
    this.myPieChart.canvas.parentNode.style.width = '150px';
  }

  getJobStatus(mainJobIndex: number, jobID: number, event?: any) {
    if (event) {
      $(event.target).addClass("fa-spin");
    }
    this.dashboardService.getJobStatus(jobID).subscribe((Response) => {
      if (event) {
        $(event.target).removeClass("fa-spin");
      }
      if (Response["status"] == 200) {
        //update status for mainjob
        let res = Response["response"];
        this.jobsList[mainJobIndex]["exStatus"] = res[0]["status"];
        //update job status for subjobs
        for (let i = 1; i < res.length; i++) {
          let subJobIndex = this.jobsList[mainJobIndex]["subjobsList"].findIndex(obj => obj["id"] == res[i]["jobId"]);
          this.jobsList[mainJobIndex]["subjobsList"][subJobIndex]["exStatus"] = res[i]["status"];
        }
      } else {
        this.toastr.error(Response["response"]);
      }
    }, error => {
      if (event) {
        $(event.target).removeClass("fa-spin");
      }
      this.toastr.error("Could not refresh status for jobID :" + jobID + "! Please refresh again.")
    })
  }

  getReForm() { return this.rerunParams.controls };
  getRdbmsRerunForm() { return this.rdbmsRerunParams.controls };

  fileReRunParamSet(lineageId: number, nodeTypeId: number) {
    this.rerunParams.patchValue({ lineageId: lineageId });
    this.rerunParams.patchValue({ nodeTypeId: nodeTypeId });
  }

  setIncrementalCol(index: number) {
    this.rdbmsReRunColumns.forEach((column, i) => {
      if (index == i) {
        column["incrementalColumn"] = true;
      } else {
        column["incrementalColumn"] = false;
      }
    });
  }

  loadRdbmsRerunCols(lineageId: number) {
    this.rdbmsRerunParams.patchValue({ lineageId: lineageId });
    this.dashboardService.fetchSavedColumns(lineageId).subscribe((res) => {
      if (res['statusType'].toLowerCase() == "info") {
        res['response'].forEach((element, i) => {
          if (element.incrementalColumn) {
            this.rdbmsRerunParams.patchValue({ selectedIncrementalData: i })
          }
        });
        this.rdbmsReRunColumns = res['response'];
      }
      else {
        this.toastr.error(res['statusMessage']);
      }
    }, error => {
      this.toastr.error("Something went wrong ! Please try again");
    })
  }

  uploadFile(files?: FileList) {
    this.rerunFile = files.item(0);
    this.rerunFileName = this.rerunFile.name;
  }

  resetReRunFile() {
    this.initFileReRunForm();
    this.rerunFile = null;
    this.rerunFileName = "Drag & Drop files here";
  }

  setFileReRunParams() {
    this.dashboardService.setFileReRunParams(this.getReForm()["loadType"]["value"], this.getReForm()["lineageId"]["value"], this.rerunFile).subscribe((Response: any) => {
      if (Response.status == 200) {
        this.toastr.success("Rerun params changes successfully");
      } else {
        this.toastr.error(Response.statusMessage);
      }
      $("#RerunOptions .modal-header button").click();
    }), error => {
      this.toastr.error("Something went wrong ! Please try again");
      $("#RerunOptions .modal-header button").click();
    }
  }

  setRdbmsRerunParams() {
    let body = {
      "lineageId": this.getRdbmsRerunForm()['lineageId']['value'],
      "loadType": this.getRdbmsRerunForm()['loadType']['value'],
    };
    if (body["loadType"] == "IncrementalLoad") {
      var selectedCol = this.rdbmsReRunColumns.find(col => col.incrementalColumn == true);
      body["incrementalColumn"] = selectedCol["columnName"];
      body["dataType"] = selectedCol["dataType"];
    };
    this.dashboardService.setRdbmsRerunParams(body).subscribe((Response: any) => {
      if (Response['statusType'].toLowerCase() == "info") {
        this.initRdbmsRerunForm();
        this.showRdbmsRerunMsg = true;
        this.status = "Success";
        this.message = Response['statusMessage'];
        setTimeout(() => {
          this.showRdbmsRerunMsg = false;
        }, 3000);
      }
      else {
        this.showRdbmsRerunMsg = true;
        this.status = "Failure";
        this.message = Response['statusMessage'];
        setTimeout(() => {
          this.showRdbmsRerunMsg = false;
        }, 3000);
      }
    }, error => {
      this.showRdbmsRerunMsg = true;
      this.status = "Failure";
      this.message = "something went wrong";
      setTimeout(() => {
        this.showRdbmsRerunMsg = false;
      }, 3000);
    })
  }

  onTimeLineScrollDown() {  
   let lastId = this.timeLineData[this.timeLineData.length - 1].id;
   this.dashboardService.fetchTimelineOnScrollDown(lastId).subscribe((response)=>
   {
    if (response['statusType'].toLowerCase() == "info") {
      response['response'].forEach(element => {
        this.timeLineData.push(element)
       });
    }
   })
  }
}
