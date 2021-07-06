import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { DataIngestionService } from './data-ingestion.service';
import { FormBuilder, AbstractControl, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-data-ingestion',
  templateUrl: './data-ingestion.component.html',
  styleUrls: ['./data-ingestion.component.css']
})
export class DataIngestionComponent implements OnInit {

  fileToUpload: File = null;
  fileName: string = ""
  csvColumns: any = []
  newFileName: any
  csvComments: string = "";
  //new filed
  showStatus: boolean = false;
  previewRes: any = []
  previewTableHeader: any = [];
  preiewBodyLength: number;
  previewTableBody: any = [];
  showTable: number;
  disablePreviewData: boolean = true;
  previewValidator: string = ""
  displayTable: boolean = true
  buttonName: string = "Preview"
  //new fileds
  status: string;
  message: string;
  isError = false;
  public filePlaceHolder = "Drag and drop files here";
  isDisable = true;
  // showDataTypes: boolean = false;
  showPreview: boolean = false;
  form: FormGroup;
  flowId: number;
  projectName: string;
  editFlag: boolean = false;
  validateTableName = new Subject<string>();
  validateProjectName = new Subject<string>();
  projectNameErrorMsg : string = ""
  tableNameErrorMsg: string = "";
  isFormInvalid: boolean = false;
  targetNodeTypeId : number;

  constructor(private dataIngestion: DataIngestionService, private CookieService: CookieService, private route: ActivatedRoute, private toastr: ToastrService, private fb: FormBuilder) {
    this.validateTableName.pipe(
      debounceTime(500),
      distinctUntilChanged())
      .subscribe(value => {
        if (!this.form.errors) {
          this.checkTableName();
        }
      });
    this.validateProjectName.pipe(
      debounceTime(500),
      distinctUntilChanged())
      .subscribe(value => {
          this.checkProjectName();
      });
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((res) => {
      this.flowId = res['params'].flowId;
      this.projectName = res['params'].project;
    })

    if (this.projectName) {
      this.editFlag = true
    }
    else {
      this.editFlag = false;
    }
    $(".moreOptions").css("display", "none");
    this.loadForm();
  }

  loadForm() {
    this.form = new FormGroup({
      destinationDb: new FormControl("psql", Validators.required),
      jobName: new FormControl(this.projectName, Validators.required),
      delimiter: new FormControl(",", Validators.required),
      quoteCharacter: new FormControl("\"", Validators.required),
      escapeCharacter: new FormControl("\\", Validators.required),
      csvComments: new FormControl("", Validators.required),
      tableName: new FormControl("", Validators.required),
    }, this.tableValidator)
  }

  tableValidator(formControl: AbstractControl) {
    if (formControl['controls'].destinationDb.value == "hive") {
      let hiveConditions = [".", ":"];
      let tableName = formControl['controls'].tableName.value
      var isInvalid = hiveConditions.some(value => tableName.includes(value));
      if (isInvalid) {
        return { 'message': "Table name should not contain . :" }
      }
      else if (!isInvalid) {
        return null;
      }
    }
    else if (formControl['controls'].destinationDb.value == "psql") {
      let psqlConditions = [".", ":", "@@", "##", "-"];
      let tableName = formControl['controls'].tableName.value
      var isInvalid = psqlConditions.some(value => tableName.includes(value));
      if (isInvalid) {
        return { 'message': "Table name should not contain . : @@ ## -" }
      }
      else if (!isInvalid) {
        return null;
      }
    }
  }

  public uploadFile(files?: FileList) {
    this.csvColumns = [];
    this.fileToUpload = files.item(0);
    let fname = this.fileToUpload.name;
    // var nameSplit = fname.split(".");
    this.fileName = fname.split(".")[0];
    this.checkTableName(true);
    this.isDisable = true;
    this.dataIngestion.uploadCSV(this.fileToUpload, this.fileName, this.form.value.delimiter).subscribe((Response: any) => {
      this.filePlaceHolder = this.fileName;
      this.disablePreviewData = false;
      this.showTable = 1;
      if (Response["status"] != 200) {
        // this.showDataTypes = true
        this.csvColumns = [];
        this.toastr.error(Response["statusMessage"]);
        return;
      }
      var res = Response.response[0].fields
      this.newFileName = Response.response[0].newFileName;
      this.csvColumns = res;
    }, error => {
      this.csvColumns = [];
      this.toastr.error("Something went wrong. Please try again!");
    })
    this.isDisable = false;
  }
  displayDateField(value: string, column: string) {
    $("#data-type-" + column).css('display', 'none');
    $("#varchar-size-" + column).css('display', 'none');

    if (value == "DATE") {

      setTimeout(function () {
        $("#data-type-" + column).css('display', 'block');
      }, 0);
    }
    else if (value == "varchar") {
      setTimeout(function () {
        $("#varchar-size-" + column).css('display', 'block');
      }, 0);
    }
  }
  submitCSV() {
    if (this.form.invalid || this.tableNameErrorMsg !="" || this.projectNameErrorMsg !="") {
      this.isFormInvalid = true
      return;
    }
    else {
      this.isFormInvalid = false
    }
    $("#submit-csv").attr('disabled', false);
    var csvJSON = [];
    $("#csvTable tr:gt(0)").each(function () {
      var this_row = $(this);
      var obj = {};
      var data1 = this_row.find('td:eq(0)');//td:eq(0) means first td of this row
      obj["columnName"] = data1.text();
      var data2 = this_row.find('td:eq(1)').find('select').val();
      obj["dataType"] = data2;
      if (data2 == "DATE") {
        obj["formate"] = this_row.find('td:eq(2)').find('select').val();
      } else if (data2 == "varchar") {
        obj["dataType"] = obj["dataType"] + "(" + this_row.find('td:eq(2)').find('input').val() + ")";
      }
      csvJSON.push(obj);
    });
    var csv = JSON.stringify(csvJSON);
    if(csv == '[]')
    {
      this.toastr.warning("please upload a file and try again");
      return;
    }
    if(this.form.value.destinationDb == "hive"){
      this.targetNodeTypeId = 60;
    }else if(this.form.value.destinationDb == "psql"){
      this.targetNodeTypeId = 25;
    }else if(this.form.value.destinationDb == "cassandra"){
      this.targetNodeTypeId = 24; 
    }else if(this.form.value.destinationDb == "snowflake"){
      this.targetNodeTypeId = 16; 
    }
    if(this.flowId)
    {
      this.dataIngestion.createCSVJob(this.form.value.tableName, csv, this.form.value.csvComments, this.targetNodeTypeId , this.fileName, this.newFileName, this.form.value.delimiter, this.form.value.quoteCharacter, this.form.value.escapeCharacter, this.form.value.jobName, this.flowId).subscribe((Response: any) => {
        if (Response.statusType == 'INFO') {
          this.toastr.success("File uploaded successfully")
        }
        else if (Response.statusType == 'ERROR' || Response.statusType == 'WARN') {
          this.toastr.error(Response["statusMessage"]);
        }
      }, (error) => {
        this.toastr.error("Something went wrong. Please try again!");
        this.resetFileFields();
      });

    }
    else {
      this.dataIngestion.createCSVJob(this.form.value.tableName, csv, this.form.value.csvComments, this.targetNodeTypeId, this.fileName, this.newFileName, this.form.value.delimiter, this.form.value.quoteCharacter, this.form.value.escapeCharacter, this.form.value.jobName, this.flowId).subscribe((Response: any) => {
        if (Response.statusType == 'INFO') {
          this.toastr.success("File uploaded successfully")
        }
        else if (Response.statusType == 'ERROR' || Response.statusType == 'WARN') {
          this.toastr.error(Response["statusMessage"]);
        }
      }, (error) => {
        this.toastr.error("Something went wrong. Please try again!");
      });
      this.resetFileFields();
     }
  }

  resetFileFields() {
    this.loadForm();
    this.filePlaceHolder = "Drag and drop files here";
    this.csvColumns = [];
    this.fileToUpload = null;
    this.isDisable = true;
    this.previewTableHeader = [];
    this.previewTableBody = [];
    // this.showDataTypes = false;
    this.showPreview = false;
  }

  preview() {
    if (this.newFileName == undefined) {
      return
    }
    if (this.buttonName == "DataTypes") {
      this.showPreview = false;
      // this.showDataTypes = true;
      this.buttonName = "Preview"
    }
    else if (this.buttonName == "Preview") {
      if (this.newFileName != this.previewValidator) {
        this.previewTableBody = []
        this.previewTableHeader = []
        this.dataIngestion.previewFile(this.newFileName, this.form.value.delimiter, this.form.value.quoteCharacter).subscribe((res) => {
          this.previewRes = res;
          this.previewValidator = this.newFileName;
          for (let i = 0; i < this.previewRes.length; i++) {
            if (i == 0) {
              this.previewTableHeader = this.previewRes[i];
            }
            else {
              this.previewTableBody.push(this.previewRes[i]);
            }
          }
          // this.showDataTypes = false;
          this.showPreview = true;
          this.buttonName = "DataTypes";
        })
      }
      else {
        // this.showDataTypes = false;
        this.showPreview = true;
        this.buttonName = "DataTypes";
      }
    }
  }

  checkProjectName()
  {
    if (this.form.value.jobName == "") {
      return
    }
      this.dataIngestion.validateProjectName(this.form.value.jobName).subscribe((response)=>
      {
        if (response['statusType'].toLowerCase() == "info") {
          this.projectNameErrorMsg = ''
        }
        else {
          this.form.controls['jobName'].markAsUntouched()
          this.projectNameErrorMsg = response['statusMessage'];
        }
      })
  }

  checkTableName(isFileUploaded?: boolean) {
    const destinationDb =
    {
      "hive": "60",
      "psql": "25",
      "snowflake": "16"
    }
    this.tableNameErrorMsg = ""
    if (isFileUploaded) {
      var reqBody =
      {
        "name": this.fileName,
        "nodeTypeId": destinationDb[this.form.value.destinationDb]
      }
      this.dataIngestion.validateTableName(reqBody).subscribe(response => {
        if (response['statusType'].toLowerCase() == "info") {
          this.form.patchValue({
            tableName: this.fileName
          })
          this.tableNameErrorMsg = ""
        }
        else {
          this.form.controls['tableName'].markAsUntouched()
          this.form.patchValue({
            tableName: this.fileName
          })
          this.tableNameErrorMsg = response['statusMessage'];
        }
      })
    }
    else if (!isFileUploaded) {
      if (this.form.value.tableName == "") {
        return
      }
      reqBody =
      {
        "name": this.form.value.tableName,
        "nodeTypeId": destinationDb[this.form.value.destinationDb]
      }
      this.dataIngestion.validateTableName(reqBody).subscribe(response => {
        if (response['statusType'].toLowerCase() == "info") {
          this.tableNameErrorMsg = ""
        }
       else {
          this.form.controls['tableName'].markAsUntouched()
          this.form.patchValue({
            tableName: this.form.value.tableName
          })
          this.tableNameErrorMsg = response['statusMessage'];
        }
      })
    }
  }

  showMoreOptions() {
    var flag = $(".moreOptions").css("display")
    if (flag == "none") {
      $(".moreOptions").css("display", "flex");
      $(".show-options").find("i").removeClass("fa-angle-down").addClass("fa-angle-up");
    }
    else if (flag == "flex") {
      $(".moreOptions").css("display", "none");
      $(".show-options").find("i").removeClass("fa-angle-up").addClass("fa-angle-down");
    }
  }
}
