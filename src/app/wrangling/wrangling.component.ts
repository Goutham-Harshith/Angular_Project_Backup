import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { WranglingService } from './wrangling.service';
@Component({
  selector: 'app-wrangling',
  templateUrl: './wrangling.component.html',
  styleUrls: ['./wrangling.component.css']
})
export class WranglingComponent implements OnInit {

  constructor(private wranglingService: WranglingService, private route: ActivatedRoute, private toastr: ToastrService, private router: Router) { }
  // Table variabless
  projectName: string;
  tname: String;
  tlevel: number;
  flowId: number;
  nodeId: number;
  tableshow: boolean;
  metaData: any = [];
  previewData: any = [];
  fromNumber: any;
  dataName: String;
  toNumber: any;
  delimiter: any;
  concatColumn: String;
  absColName: String;
  toDate: any;
  fromDate: any;
  datasetName: String;
  replaceValue: any;
  currentValue: any;
  columHead: any;
  columnMetadata = {};
  newConcat: String;
  enableLogs: boolean = false
  selectedColName: String;
  newDFname: any;
  inputColumn: any;
  previewTableName: String;
  previewFolderName: String;

  // disable wrangling
  findDiable: boolean;
  dFilterDisable: boolean;
  nFilterDisable: boolean;
  concatDisable: boolean;
  scalingDisable: boolean;
  metaDtataDisable: boolean;
  isFind: boolean = true;
  isDateFilter: boolean = true;
  isNumFilter: boolean = true;
  isScaling: boolean = true;
  isConcat: boolean = true;
  isMetadata: boolean = true;
  numDataTypes = ["int", "double", "float", "decimal", "numeric", "number", "serial"];
  stringDataTypes = ["string", "text", "varchar"];
  dateDataTypes = ["date", "timestamp"];
  concatColumnsList = [];

  ngOnInit() {
    // button disable
    this.findDiable = true;
    this.dFilterDisable = true;
    this.nFilterDisable = true;
    this.concatDisable = true;
    this.scalingDisable = true;
    this.metaDtataDisable = true;

    // wrangling disable variables
    this.isFind = true;
    this.isDateFilter = true;
    this.isNumFilter = true;
    this.isScaling = true;
    this.isConcat = true;
    this.isMetadata = true;
    this.route.queryParams.subscribe(params => {
      this.projectName = params['projectName'];
      this.flowId = parseInt(params['flowId']);
      this.tname = (params['tname']);
      this.tlevel = parseInt(params['tlevel']);
      this.nodeId = parseInt(params['lineageId']);
      if (this.tlevel == 23) {
        this.getFolderPreview();
      } else {
        this.previewTableName = this.tname;
        this.getMetaData();
        this.getPreviewData();
      }
    });
    $(document).ready(function () {
      $('.collapse_btn').click(function () {
        $(this).toggleClass('fa-plus-circle fa-minus-circle')
        $('.collapse_btn').not(this).addClass('fa-plus-circle');
        $('.collapse_btn').not(this).removeClass('fa-minus-circle');
      });

      // Add minus icon for collapse element which is open by default

      $(".collapse.show").each(function () {
        $(this).prev(".card-header").find(".fa").addClass("fa-minus-circle").removeClass("fa-plus-circle");
      });

      // Toggle plus minus icon on show hide of collapse element

      $(".collapse").on('show.bs.collapse', function () {
        $(this).prev(".card-header").find(".rdbms_target_cont").fadeIn();
        $(this).prev(".card-header").find(".fa").removeClass("fa-plus-circle").addClass("fa-minus-circle");
      }).on('hide.bs.collapse', function () {
        $(this).prev(".card-header").find(".rdbms_target_cont").fadeOut();
        $(this).prev(".card-header").find(".fa").removeClass("fa-minus-circle").addClass("fa-plus-circle");
      });

    })

  }

  getMetaData() {
    let body = {
      "name": this.tname,
      "nodeTypeId": this.tlevel
    }
    this.wranglingService.getMetaDataService(body).subscribe((response: any) => {
      this.metaData = response.response;
    })
  }

  getPreviewData() {
    let body = {
      "name": this.tname,
      "nodeTypeId": this.tlevel
    }
    this.wranglingService.getPreviewDataService(body).subscribe((response: any) => {
      // this.columHead = response.response[0];
      this.previewData = response.response;
      // delete this.previewData[0];
    })
  }

  getFolderPreview() {
    this.wranglingService.folderPreview(this.nodeId, this.tlevel).subscribe((Response: any)=> {
      console.log("Response is ", Response);
      this.previewTableName = this.tname;
      var folderPreviewTable =[];
      folderPreviewTable.push(["Path","Size(Kb)"]);
      Response.response.forEach(element => {
        folderPreviewTable.push([element.path, element.size]);
      });
      this.previewData = folderPreviewTable;
      this.previewFolderName = Response["filePath"];
    })
  }

  loadFile(fileName: string) {
    var fileLoc = this.previewFolderName + "/" + fileName;
    this.wranglingService.filePreview(fileLoc, this.tlevel).subscribe((Response: any)=>{
      if(Response.response) {
        let linkSource;
        switch (fileName.split('.')[1]){
          case "pdf":
            linkSource = 'data:application/pdf;base64,' + Response.response;
            break;
          case "csv":
            linkSource = "data:text/csv;charset=utf-8," + Response.response;
            break;
        }
        const downloadLink = document.createElement("a");
        const file = fileName;
        downloadLink.href = linkSource;
        downloadLink.download = file;
        downloadLink.click();
      } else {
        this.toastr.error("Could not load file: " + Response.statusMessage);
      }
    })
  }

  clickColumn(index?) {
    var targetIndex, elements;
    targetIndex = index + 1;
    elements = $("th ,td");
    elements.filter(":nth-child(" + targetIndex + ")").addClass("highlight");
    elements.not(":nth-child(" + targetIndex + ")").removeClass("highlight");
  }

  enableFilters() {
    this.isFind = true;
    this.isConcat = true;
    this.isMetadata = true;
    this.concatDisable = false;
    this.scalingDisable = true;
    this.metaDtataDisable = false;
    this.findDiable = false;
    this.isScaling = false;
  }

  isNumField(dataType: string) {
    let isNumDtype = false;
    for (let i = 0; i < this.numDataTypes.length; i++) {
      if (dataType.toLowerCase().includes(this.numDataTypes[i])) {
        isNumDtype = true;
        break;
      }
    }
    return isNumDtype;
  }

  isStringField(dataType: string) {
    let isStringDtype = false;
    for (let i = 0; i < this.stringDataTypes.length; i++) {
      if (dataType.toLowerCase().includes(this.stringDataTypes[i])) {
        isStringDtype = true;
        break;
      }
    }
    return isStringDtype;
  }

  isDateField(dataType: string) {
    let isDateDtype = false;
    for (let i = 0; i < this.dateDataTypes.length; i++) {
      if (dataType.toLowerCase().includes(this.dateDataTypes[i])) {
        isDateDtype = true;
        break;
      }
    }
    return isDateDtype;
  }

  // selecting column
  selectColumn(col: string, i: number) {
    if(this.tlevel == 23) {
      return;
    }
    this.inputColumn = col;
    this.concatColumnsList = this.metaData;
    this.clickColumn(i);
    this.selectedColName = col;
    this.columnMetadata = this.metaData[i];
    this.enableLogs = true;
    if (this.isNumField(this.metaData[i].TYPE_NAME)) {
      this.resetWarnglingOptions();
      this.currentValue = "";
      this.enableLogs = true;
      this.enableFilters();
      this.dFilterDisable = true;
      this.nFilterDisable = false;
      this.isDateFilter = false;
      this.isNumFilter = true;
    }
    if (this.isStringField(this.metaData[i].TYPE_NAME)) {
      this.resetWarnglingOptions();
      this.enableFilters();
      this.dFilterDisable = true;
      this.nFilterDisable = true;
      this.isDateFilter = false;
      this.isNumFilter = false;
      this.currentValue = "";
    }
    if (this.isDateField(this.metaData[i].TYPE_NAME)) {
      this.resetWarnglingOptions();
      this.enableFilters();
      this.dFilterDisable = false;
      this.nFilterDisable = true;
      this.isDateFilter = true;
      this.isNumFilter = false;
    }
  }

  // reseting wrangling options
  resetFindNReplace() {
    this.currentValue = "";
    this.replaceValue = "";
    this.datasetName = "";
  }

  resetDatefilter() {
    this.fromDate = "";
    this.toDate = "";
    this.newDFname = "";
  }

  resetNumFilter() {
    this.fromNumber = "";
    this.toNumber = "";
    this.dataName = "";
  }

  resetConcat() {
    this.concatColumn = "";
    this.delimiter = "";
    this.absColName = "";
  }

  resetWarnglingOptions() {
    this.resetFindNReplace();
    this.resetDatefilter();
    this.resetNumFilter();
    this.resetConcat();
  }

  // find and replace
  findAndreplace() {
    let body = {
      "task": this.datasetName,
      "value": this.replaceValue,
      "preValue": this.currentValue,
      "oldTableName": this.tname,
      "newTableName": this.datasetName,
      "absColumnName": this.selectedColName,
      "selectedFlowId": this.flowId,
      "level": this.tlevel

    }
    this.toastr.info("processing the wrangling option");
    this.wranglingService.findNadReplace(body).subscribe(res => {
      this.resetFindNReplace();
      if (res.status == 500) {
        this.toastr.error("Job execution Failed");
      }
      if (res.status == 200) {
        this.toastr.success("Job execution success");
        this.router.navigate(['/lineage'],
          { queryParams: { 'flowId': this.flowId, 'projectName': this.projectName } })
      }
    })
  }
  // filtering 
  Datefilter() {
    let body = {
      "task": "",
      "fromDate": this.fromDate,
      "toDate": this.toDate,
      "oldTableName": this.tname,
      "newTableName": "",
      "absColumnName": this.selectedColName,
      "level": this.tlevel,
      "selectedFlowId": this.flowId

    }
    this.toastr.info("processing the wrangling option");
    this.wranglingService.filterByDate(body).subscribe(res => {
      if (res.status == 500) {
        this.toastr.error("Job execution Failed");
      }
      if (res.status == 200) {
        this.toastr.success("Job execution success");
        this.router.navigate(['/lineage'],
          { queryParams: { 'flowId': this.flowId, 'projectName': this.projectName } })
      }
      this.resetDatefilter();
    })
  }

  numFilter() {
    let body = {
      "task": "",
      "fromNumber": this.fromNumber,
      "toNumber": this.toNumber,
      "oldTableName": this.tname,
      "newTableName2": this.dataName,
      "absColumnName": this.selectedColName,
      "level": this.tlevel,
      "selectedFlowId": this.flowId

    }
    this.toastr.info("processing the wrangling option");
    this.wranglingService.filteBynumber(body).subscribe(res => {
      if (res.status == 500) {
        this.toastr.error("Job execution Failed");
      }
      if (res.status == 200) {
        this.toastr.success("Job execution success");
        this.router.navigate(['/lineage'],
          { queryParams: { 'flowId': this.flowId, 'projectName': this.projectName } })
      }
      this.resetNumFilter();
    })
  }

  // concat columns
  concatColumns() {
    let body = {
      "task": "concat columns",
      "oldTableName": this.tname,
      "newTableName": this.newConcat,
      "absColumnName": this.absColName,
      "column1": this.selectedColName,
      "column2": this.concatColumn,
      "deLimiter": this.delimiter,
      "level": this.tlevel,
      "selectedFlowId": this.flowId
    }
    this.toastr.info("processing the wrangling option");
    this.wranglingService.concatColumns(body).subscribe(res => {
      if (res.status == 500) {
        this.toastr.error("Job execution Failed");
      }
      if (res.status == 200) {
        this.toastr.success("Job execution success");
        this.router.navigate(['/lineage'],
          { queryParams: { 'flowId': this.flowId, 'projectName': this.projectName } })
      }
      this.resetConcat();
    })
  }

  // redirect to lineage
  redirectToLineage() {
    this.router.navigate(['/lineage'],
      { queryParams: { 'flowId': this.flowId, 'projectName': this.projectName } })
  }
}
