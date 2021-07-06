import { Component, OnInit } from '@angular/core';
import { environment } from './../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { RdbmsDataIngestionService } from './rdbms-data-ingestion.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DataIngestionService } from '../data-ingestion/data-ingestion.service';

@Component({
  selector: 'app-rdbms-data-ingestion',
  templateUrl: './rdbms-data-ingestion.component.html',
  styleUrls: ['./rdbms-data-ingestion.component.css']
})
export class RdbmsDataIngestionComponent implements OnInit {

  public showRDBMSingestion: boolean = false
  public rdbmsSelect: any = "1";
  form: FormGroup;
  destinationDb: string = "psql";
  tableList: any = [];
  tablesList: Array<any>;
  tempTablesList: Array<any>;
  public rdbmsSchema: boolean = false;
  connectDisable: boolean = true;
  selectedSchema: any = [];
  tables: any = [];
  jobsList: Array<any>;
  tempJobsList: Array<any>
  connectSuccess: boolean = false;
  connectError: boolean = false;
  resetConnectForm: boolean = false;
  isDummy: boolean = false;
  public tableSearchText: string = "";
  isHiveConnection = false;
  dummyPopup: boolean = false;
  showHorizontalLoader: boolean = false;
  connectFormValue: any;
  commentFlag: boolean = false;
  private columnSelected: boolean = false;
  private isDestTableNameAbsent: boolean = false;
  public comments: string = "";
  private tablesSelected = [];
  tablesSelected1: any = []
  Enable: boolean = false;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {
    singleSelection: false,
    text: "Select Schema",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    autoPosition: false,
    maxHeight: 150
  };
  jobName: string;
  flowId: number;
  editFlag: boolean = false;
  targetNodeTypeId: number;
  validateProjectName = new Subject<string>();
  projectNameErrorMsg: string = "";
  selectionType: string = "fileUpload";
  filePlaceHolder = "Drag and drop files here";
  fileToUpload: File = null;
  fileUploadKeys = [];

  constructor(private route: ActivatedRoute, private service: DataIngestionService, private RdbmsDataIngestionService: RdbmsDataIngestionService, private toastr: ToastrService) {
    this.validateProjectName.pipe(
      debounceTime(500),
      distinctUntilChanged())
      .subscribe(value => {
        this.checkProjectName();
      });
  }

  ngOnInit() {

    this.route.queryParamMap.subscribe((res) => {
      this.flowId = res['params'].flowId
      this.jobName = res['params'].project
    })

    if (this.jobName) {
      this.editFlag = true
    }
    else {
      this.editFlag = false;
    }

    this.initRDBMSFields();
    $(document).ready(function () {
      $('.collapse_btn').click(function () {
        $(this).toggleClass('fa-plus-circle fa-minus-circle')
        $('.collapse_btn').not(this).addClass('fa-plus-circle');
        $('.collapse_btn').not(this).removeClass('fa-minus-circle');
      });
      $(".collapse.show").each(function () {
        $(this).prev(".card-header").find(".fa").addClass("fa-minus-circle").removeClass("fa-plus-circle");
      });
      $(".collapse").on('show.bs.collapse', function () {
        $(this).prev(".card-header").find(".rdbms_target_cont").fadeIn();
        $(this).prev(".card-header").find(".fa").removeClass("fa-plus-circle").addClass("fa-minus-circle");
      }).on('hide.bs.collapse', function () {

        $(this).prev(".card-header").find(".rdbms_target_cont").fadeOut();
        $(this).prev(".card-header").find(".fa").removeClass("fa-minus-circle").addClass("fa-plus-circle");
      });
    })
  }

  checkProjectName() {
    if (this.jobName == "") {
      return
    }
    this.service.validateProjectName(this.jobName).subscribe((response) => {
      if (response['statusType'].toLowerCase() == "info") {
        this.projectNameErrorMsg = ''
      }
      else {
        this.projectNameErrorMsg = response['statusMessage'];
      }
    })
  }

  get dbUser() {
    return this.form.get('dbUser');
  }
  get driverClass() {
    return this.form.get('driverClass');
  }
  get dbName() {
    return this.form.get('dbName');
  }
  get dbUrl() {
    return this.form.get('dbUrl');
  }
  get dbPort() {
    return this.form.get('dbPort');
  }
  get dbPassword() {
    return this.form.get('dbPassword');
  }
  get type() {
    return this.form.get('type');
  }

  initRDBMSFields() {
    this.fileToUpload = null;
    this.filePlaceHolder = "Drag and drop files here";
    this.selectionType = "fileUpload"
    this.form = new FormGroup({
      dbPort: new FormControl(environment.dbPort, Validators.required),
      dbName: new FormControl(environment.dbName, Validators.required),
      dbUrl: new FormControl(environment.dbUrl, Validators.required),
      driverClass: new FormControl(environment.driverClass, Validators.required),
      dbUser: new FormControl(environment.dbUser, [Validators.required, Validators.minLength(3)]),
      dbPassword: new FormControl(environment.dbPassword, Validators.required),
      dbSchemas: new FormControl(""),
      type: new FormControl("table", Validators.required)
    });
  }

  public fetchSchemas() {
    $(".reload img").addClass("rotate");
    this.dropdownList = []
    if (this.form.value["dbUrl"].indexOf("hive") !== -1) {
      this.dummyPopup = true;
    }
    var ctrl = this.form.controls;
    if (ctrl.dbName.valid && ctrl.dbPassword.valid && ctrl.dbPort.valid && ctrl.dbUrl.valid && ctrl.dbUser.valid && ctrl.driverClass.valid && this.rdbmsSchema) {
      this.RdbmsDataIngestionService.fetchSchemaList(this.form.value).subscribe((response: any) => {
        this.dropdownList = [];
        $(".reload img").removeClass("rotate");
        if (response.statusType.toLowerCase() == "info") {
          var schemas = [];
          schemas = response.response;
          if (schemas.length == 0) {
            this.toastr.error("No Schemas loaded");
          };
          this.dropdownSettings['text'] = "Select Schema";
          for (let i = 0; i < schemas.length; i++) {
            var obj = {};
            obj["id"] = i + 1;
            obj["itemName"] = schemas[i];
            this.dropdownList.push(obj);
          }
        }
        else if (response.statusType.toLowerCase() == "error") {
          this.toastr.error(response.statusMessage);
          this.dropdownList = [];
        }
      }, error => {
        $(".reload img").removeClass("rotate");
        this.toastr.error("Something went wrong please try again!!");
        this.dropdownList = [];
      })
    }
  }

  submitConnectForm(formValue: any) {
    this.fileUploadKeys = [];
    if (formValue["dbUrl"].toLowerCase().indexOf('hive') !== -1) {
      this.isHiveConnection = true;
      this.dummyPopup = true;
    }
    var arr = [];
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      control.markAsTouched({ onlySelf: true });
    });
    formValue["dbSchemas"] = this.selectedSchema.join();
    if (this.selectedSchema.length != 0) {
      this.form.controls["dbSchemas"].setValue(this.selectedSchema.join());
      this.form.controls["dbSchemas"].setErrors(null);
    }
    if (this.form.valid) {
      this.showHorizontalLoader = true;
      this.connectFormValue = formValue;
      this.RdbmsDataIngestionService.fetchTablesList(formValue).subscribe((response: any) => {
        if (formValue["dbUrl"].toLowerCase().indexOf('hive') !== -1) {
          this.isHiveConnection = true;
          this.dummyPopup = true;
        }
        this.showHorizontalLoader = false;
        if (response.statusType.toLowerCase() == "info") {
          this.tableList = response.response.records;
          this.toastr.success(response.statusMessage)
          this.rdbmsSelect = "2";
          for (let i = 0; i < this.tableList.length; i++) {
            this.tableList[i].destName = this.tableList[i].entityName + "_dest";
          }
          this.tablesList = response.response.records;
          this.commentFlag = true;
          this.showRDBMSingestion = true;
          this.Enable = true;
          this.tablesList.forEach(function (obj) {
            obj.allCloumnsChecked = false;
            obj.partitionCol = '';
          })
          this.tempTablesList = JSON.parse(JSON.stringify(this.tablesList));
        }
        else if (response.statusType.toLowerCase() == "error") {
          this.toastr.error(response.statusMessage);
        }

      }, (err: any) => {
        this.toastr.error("Something went wrong please try again!!")
      });
    }
  }
  pageConfig = {
    itemsPerPage: 7,
    currentPage: 1
  };
  getParsedName(name, prefix) {
    return prefix ? prefix + "_" + name.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '_') : name.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '_');
  }
  fetchColumns(table: any, e: any) {

    if ($(e.target).parents(".panel-heading").hasClass("maximize")) {
      $(e.target).parents(".panel-default").removeClass("maximize");
      $(e.target).parents(".panel-heading").removeClass("maximize").find(".icon").removeClass("minimize").addClass("maximize");
    }
    else {
      if ($(e.target).hasClass("fa-plus-circle")) {
        $(".fa-minus-circle").removeClass("fa-minus-circle").addClass("fa-plus-circle");
        $(e.target).removeClass("fa-plus-circle").addClass("fa-minus-circle");
      }
      else if ($(e.target).hasClass("fa-minus-circle")) {
        $(e.target).removeClass("fa-minus-circle").addClass("fa-plus-circle");
      }
    }
    if (this.fileUploadKeys.length != 0) {
      document.getElementById(table.entityName).removeAttribute('disabled');
      if (typeof table.columnsFetched == 'undefined') {
        this.connectFormValue.tableName = table.entityName;
        this.connectFormValue.dbSchemas = table.schema;
        let idx = this.tablesList.indexOf(table);
        this.tablesList[idx].columnsFetched = true;
        this.tempTablesList[idx].columnsFetched = true;
      }
    }
    else {
      this.fetchColumnsList(table);
    }

  }
  fetchColumnsList(table: any) {
    let idx = this.tablesList.indexOf(table);
    if (typeof table.columnsFetched == 'undefined') {
      this.connectFormValue.tableName = table.entityName;
      this.connectFormValue.dbSchemas = table.schema;
      this.RdbmsDataIngestionService.fetchColumnsList(this.connectFormValue).subscribe((response: any) => {
        if (response.statusType.toLowerCase() == "info") {
          let responseJson = response.response;
          for (let i = 0; i < responseJson.length; i++) {
            responseJson[i].checked = table.allCloumnsChecked;
            responseJson[i].condition = ''
          }
          this.tablesList[idx].columnsList = responseJson;
          this.tablesList[idx].columnsFetched = true;
          this.tempTablesList[idx].columnsList = responseJson;
          this.tempTablesList[idx].columnsFetched = true;
          document.getElementById(table.entityName).removeAttribute('disabled')
        }
        else if (response.statusType.toLowerCase() == "error") {
          this.toastr.error(response.statusMessage);
        }
      },
        error => {
          this.toastr.error("Something went wrong please try again!!");
        });
    }
    else {
      document.getElementById(table.entityName).removeAttribute('disabled')
    }
  }

  checkAllColumns(table: any, e: any) {
    let idx = this.tablesList.indexOf(table);
    table.allCloumnsChecked = e;
    this.tablesList[idx].allCloumnsChecked = e;
    this.tablesList[idx].columnsList.forEach(function (obj: { checked: any; }) {
      obj.checked = e;
    })
  }
  checkColumns(table: any, column: any, e: any) {
    let idx = this.tablesList.indexOf(table);
    let columnsList = this.tablesList[idx].columnsList;
    let cidx = columnsList.indexOf(column);
    this.tablesList[idx].columnsList[cidx].checked = e;
    if (e == false) {
      this.tablesList[idx].allCloumnsChecked = false;
    }
  }
  checkVal() {
    if (this.jobName == "" || this.jobName == undefined || this.comments == "" || this.comments == undefined || this.projectNameErrorMsg != "") {
      return;
    }
    this.columnSelected = false;
    this.isDestTableNameAbsent = false;
    this.tablesSelected = [];
    this.tablesSelected1 = []
    for (let obj of this.tablesList) {
      if (obj.allCloumnsChecked == true) {
        this.tablesSelected.push(obj.entityName);
        this.tablesSelected1.push(obj);
        this.columnSelected = true;
      }
      else if (obj.columnsList) {
        for (var i = 0; i < obj.columnsList.length; i++) {
          if (obj.columnsList[i].checked == true) {
            if ((this.tablesSelected.length <= 0) && (this.tablesSelected1.length <= 0)) {
              this.tablesSelected.push(obj.entityName);
              this.tablesSelected1.push(obj);
              this.columnSelected = true;
            }
          }
        }
      }
    }
    if (this.tablesSelected1.length > 0) {
      for (let eachTblSelected of this.tablesSelected1) {
        if (eachTblSelected.destName == "" || eachTblSelected.destName == null) {
          this.isDestTableNameAbsent = true;
        }
      }
    }
    else {
      this.toastr.warning("Select atleast one table");
    }
    if ((this.columnSelected == true) && (this.isDestTableNameAbsent == false)) {
      this.createJob();
    }
    else if ((this.columnSelected == false) && (this.isDestTableNameAbsent == true)) {
      $("#action-result .action-icon").addClass("failure");
      $("#action-result .action-text").find("span").text("Please select atleast one table");
      $("#openRDBMSPopup").find("#action-result").show().delay(2000).fadeOut();
    }
    else if (this.columnSelected == false) {
      $("#action-result .action-icon").addClass("failure");
      $("#action-result .action-text").find("span").text("Please select atleast one table");
      $("#openRDBMSPopup").find("#action-result").show().show().delay(2000).fadeOut();
    }
    else if (this.isDestTableNameAbsent == true) {
      $("#action-result .action-icon").addClass("failure");
      $("#action-result .action-text").find("span").text("Destination Table Name is mandatory.");
      $("#openRDBMSPopup").find("#action-result").show().delay(2000).fadeOut();
    }
  }

  createJob() {
    var createTableJson: any = {};
    var createTableJson1: any = {};
    this.tablesList.forEach(function (obj) {
      if (obj.columnsFetched == true) {
        for (var i = 0; i < obj.columnsList.length; i++) {
          if (obj.columnsList[i].checked == true) {
            createTableJson1["destTableName_" + obj.schema + "@" + obj.entityName] = obj.destName;
            createTableJson1["srcTableName_" + obj.schema + "@" + obj.entityName] = obj.entityName;
            createTableJson1["srcColumnDType_" + obj.schema + "@" + obj.entityName + "." + obj.columnsList[i].entityName] = obj.columnsList[i].dtype;
            createTableJson1["srcColumnName_" + obj.schema + "@" + obj.entityName + "." + obj.columnsList[i].entityName] = obj.columnsList[i].entityName;
            createTableJson1["srcColumnIndex_" + obj.schema + "@" + obj.entityName + "." + obj.columnsList[i].entityName] = obj.columnsList[i].columnId;
            createTableJson1["primaryKeyColumn_" + obj.schema + "@" + obj.entityName] = obj.primaryKeyColumn;
            createTableJson1["schema_" + obj.schema + "@" + obj.entityName] = obj.schema;
            if (obj.splitByColumnName) {
              createTableJson1["split_by_" + "@" + obj.entityName] = obj.splitByColumnName;
            }
            if (obj.columnsList[i].condition != undefined) {
              createTableJson1["srcColumnCond_" + obj.schema + "@" + obj.entityName + "." + obj.columnsList[i].entityName] = obj.columnsList[i].condition;
            }
          }
        }
        if (obj.partitionCol != '') {
          createTableJson1["partitionColumn_" + obj.schema + "@" + obj.entityName] = obj.partitionCol;
        }
      }
    });
    if (this.destinationDb == "hive") {
      this.targetNodeTypeId = 60;
    } else if (this.destinationDb == "psql") {
      this.targetNodeTypeId = 25;
    } else if (this.destinationDb == "cassandra") {
      this.targetNodeTypeId = 24;
    } else if (this.destinationDb == "snowflake") {
      this.targetNodeTypeId = 16;
    }
    createTableJson["jsonTblColsInfo"] = createTableJson1;
    createTableJson.dbUser = this.connectFormValue.dbUser;
    createTableJson.driverClass = this.connectFormValue.driverClass;
    createTableJson.dbUrl = this.connectFormValue.dbUrl;
    createTableJson.dbPassword = this.connectFormValue.dbPassword;
    createTableJson.dbName = this.connectFormValue.dbName;
    createTableJson.dbPort = this.connectFormValue.dbPort;
    createTableJson.comments = this.comments;
    createTableJson.isHive = this.isHiveConnection;
    createTableJson.isDummy = this.isDummy;
    createTableJson.trgNodeTypeId = this.targetNodeTypeId;
    createTableJson.srcNodeTypeId = 26; //for oracle need to remove this hardcoding keep it as per driver selected
    if (this.flowId) {
      createTableJson.flowId = this.flowId;
    }
    else {
      createTableJson.jobName = this.jobName;
    }

    this.RdbmsDataIngestionService.createJob(createTableJson).subscribe((response: any) => {
      var res = JSON.parse(response);
      if (res.statusType.toLowerCase() == "info") {
        this.rdbmsSelect = "1";
        this.comments = "";
        this.jobName = "";
        this.tablesSelected1 = []
        this.toastr.success(res.statusMessage)
        $("#openRDBMSPopup").find("#action-result").show();
        $("#action-result .action-icon").removeClass("failure").addClass("success");
        $("#action-result .action-text").find("span").text("Job Created Successfully");
        this.jobsList = null;
        this.tempJobsList = null;
        this.isHiveConnection = false;
      }
      else if (res.statusType.toLowerCase() == "error") {
        this.toastr.error(res.statusMessage)
      }
    },
      error => {
        this.toastr.error("Something went wrong please try again!!");
      });
  }
  public ReloadSchema() {
    this.rdbmsSchema = true;
    this.fetchSchemas();
  }

  backConnect() {
    this.rdbmsSelect = "1";
    this.dropdownList = [];
    this.selectedItems = []
    this.selectedSchema = [];
  }

  dummyPoupMethod(flag) {
    if (flag == true) {
      this.isDummy = true
    }
    else {
      this.isDummy = false
    }
  }

  onItemSelect(item: any, isAll) {
    if (item) {
      if (isAll) {
        let schemas = []
        for (let i = 0; i < item.length; i++) {
          schemas.push(item[i]['itemName'])
        }
        this.selectedSchema = schemas;
      } else {
        this.selectedSchema.push(item['itemName']);
      }
      this.connectDisable = false;
    }
  }

  OnItemDeSelect(item: any, isAll) {
    if (isAll) {
      this.selectedSchema = [];
    } else {
      let index = this.selectedSchema.indexOf(item['itemName']);
      if (index != -1) {
        this.selectedSchema.splice(index, 1);
      }
    }
    if (this.selectedSchema.length < 1) {
      this.connectDisable = true;
    }
  }

  isRdbmsFileuploadFormValid() {
    if (this.form.controls.dbPort.valid && this.form.controls.dbName.valid && this.form.controls.dbUrl.valid && this.form.controls.driverClass.valid && this.form.controls.dbUser.valid && this.form.controls.dbPassword.valid && this.form.controls.type.valid && this.fileToUpload != null) {
      return true
    }
    else {
      return false;
    }
  }

  uploadFile(files: FileList) {
    this.isRdbmsFileuploadFormValid();
    this.fileToUpload = files.item(0);
    this.filePlaceHolder = files.item(0).name;
  }

  createJobUsingFileUpload(formValue) {
    this.tableList = []
    this.RdbmsDataIngestionService.jobCreationUsingExcel(this.fileToUpload, this.form.controls.dbPort.value, this.form.controls.dbName.value, this.form.controls.dbUrl.value, this.form.controls.driverClass.value, this.form.controls.dbUser.value, this.form.controls.dbPassword.value, this.form.controls.type.value).subscribe((res) => {

      if (res['statusType'].toLowerCase() == "info") {
        let response = res['response'][0];
        this.fileUploadKeys = Object.keys(res['response'][0]);
        this.tableList = []
        this.connectFormValue = formValue;
        
        this.fileUploadKeys.forEach(element => {
          if (element.startsWith("schema")) {
            let schemaIndex = element.indexOf("_") + 1;
            let tableIndex = element.indexOf("@");
            let schemaName = element.slice(schemaIndex, tableIndex);
            let tableName = element.slice(tableIndex + 1, element.length);
            let body =
            {
              "schema": schemaName,
              "entityName": tableName,
              "key": tableName,
              "allCloumnsChecked": true,
              "columnsList": []
            }
            this.tableList.push(body);
          }
        });

        this.fileUploadKeys.forEach(element => {
          let isdestTableName = element.startsWith("destTableName");
          let isPrimaryKeyColumn = element.startsWith("primaryKeyColumn");
          let isPartitionColumn = element.startsWith("partitionColumn")
          if (isdestTableName || isPrimaryKeyColumn || isPartitionColumn) {
            let tableIndex = element.indexOf("@");
            let tableName = element.slice(tableIndex + 1, element.length);
            let index: number = this.getIndexOfSourceTableName(tableName);
            if(isdestTableName)
            {
              this.tableList[index].destName = response[element];
            }
            else if(isPrimaryKeyColumn)
            {
              this.tableList[index].primaryKeyColumn = response[element];
            }
            else if(isPartitionColumn)
            {
              this.tableList[index].partitionCol = response[element];
            }
            
          }
        })

        this.fileUploadKeys.forEach(element => {
          if (element.startsWith("srcColumnName")) {
            let tableIndex = element.indexOf("@");
            let columnIndex = element.indexOf(".");
            let tableName = element.slice(tableIndex + 1, columnIndex);
            let columnName = element.slice(columnIndex + 1, element.length);
            let body =
            {
              "checked": true,
              "entityName": columnName,
              "columnId": ''
            }
            let index: number = this.getIndexOfSourceTableName(tableName);
            this.tableList[index].columnsList.push(body);
          }
        })

        this.fileUploadKeys.forEach(element => {
          let isSrcColumnDType = element.startsWith("srcColumnDType");
          let isSrcColumnCond = element.startsWith("srcColumnCond");
          if (isSrcColumnDType || isSrcColumnCond) {
            let tableIndex = element.indexOf("@");
            let columnIndex = element.indexOf(".");
            let tableName = element.slice(tableIndex + 1, columnIndex);
            let columnName = element.slice(columnIndex + 1, element.length);
            let indexes = this.getIndexOfColumnName(tableName, columnName);
            if(isSrcColumnDType)
            {
              this.tableList[indexes[0]].columnsList[indexes[1]].dtype = response[element];
            }
            else{
              this.tableList[indexes[0]].columnsList[indexes[1]].condition = response[element];
            }
           
          }
        })
        this.tempTablesList = this.tableList;
        this.tablesList = this.tableList;
        this.rdbmsSelect = 2;
      }
      else {
        this.toastr.error(res['statusMessage']);
      }
    }, error => {
      this.toastr.error("Something went wrong. Please try again!")
    })
  }

  getIndexOfSourceTableName(tableName: string) {
    let tableIndex: number;
    this.tableList.forEach((element, index) => {
      if (element.entityName == tableName) {
        tableIndex = index;
      }
    })
    return tableIndex;
  }

  getIndexOfColumnName(tableName: string, columnName: string) {
    let indexes = []
    let tableIndex: number;
    this.tableList.forEach((tableElement, index) => {
      if (tableElement.entityName == tableName) {
        tableIndex = index;
        indexes.push(tableIndex)
        let columnindex: number;
        this.tableList[tableIndex].columnsList.forEach((columnElement, index1) => {
          if (columnElement.entityName == columnName) {
            columnindex = index1;
          }
        });
        indexes.push(columnindex);
      }
    })
    return indexes;
  }



}
