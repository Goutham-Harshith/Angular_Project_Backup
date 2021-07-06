import { Component, OnInit } from '@angular/core';
import { ScriptWriterService } from './script-writer.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/sql/sql';
import 'codemirror/mode/python/python';
import 'codemirror/mode/r/r';
import 'codemirror/mode/shell/shell';
import 'codemirror/mode/clike/clike';
import { Constants } from 'src/constants';
import { DataIngestionService } from '../data-ingestion/data-ingestion.service';
import { switchMap } from 'rxjs/operators';
import { timer } from 'rxjs'

@Component({
  selector: 'app-script-writer',
  templateUrl: './script-writer.component.html',
  styleUrls: ['./script-writer.component.css']
})
export class ScriptWriterComponent implements OnInit {

  code: string = '';
  gitFoldersDetails: any;
  selectedGitFolderDetails: Array<any> = [];
  selectedFolder: string = '';
  fileNameSearchPara: string = '';
  cmFileName: string = '';
  filePath: string = '';
  fileVersions = [];
  selCommitID: string;
  method: string = "getCodeOf";
  bucketName: string = '';
  executionMode: string = '';
  runComment: string = '';
  saveAndRunCommit: string = ''
  newFilename: string;
  newFoldername: string;
  selectedItems = [];
  addFile: FormGroup;
  commitForm: FormGroup;
  deleteGitFileForm: FormGroup;
  editGitFileForm : FormGroup;
  zeppelinRunForm: FormGroup;
  status: string = "Success";
  message: string = "";
  showAddFilesMsg: boolean = false;
  showCodeCommitMsg: boolean = false;
  showRunScriptMsg: boolean = false;
  showEditGitFileMsg : boolean = false;
  showDeleteGitFileMsg
  flowId: number;
  tname: string;
  tlevel: string;
  lineageId: number;
  nodeName: string = "";
  isDvcFile: boolean = false
  sourceType = [];
  interpreterDetails = {
    "sh": "shell",
    "python": "python",
    "psql": "sql",
    "hql": "sql",
    "sql": "sql",
    "mysql": "sql",
    "snowflakesql": "sql",
    "cassandrasql": "sql",
    "java": "clike",
    "pyspark": "python",
    "r": "r",
    "spark.r": "r"
  };
  selectedInterpreter: string = "python";
  cmOptions = {
    "mode": "python",
    "lineNumbers": true,
    "theme": 'dracula',
    "autoCloseBrackets": true,
    "autoCloseTags": true
  }
  projectName: string;
  filePlaceHolder: string = "Upload a file";
  folderPath = [];
  sourcesList = [];
  dropdownSettings = {
    text:"Select Sources",
    enableSearchFilter: true,
    badgeShowLimit: 5,
    maxHeight: 150,
    labelKey: "name",
    groupBy: "nodeType"
  };
  selectedSourceNodes = [];
  targetTypes = ["FILE","FOLDER","HDFS","NEO4J","HBASE","MONGO","PPT","LOCDIR","SNOWFLAKE","SFTP","CASSANDRA","MINIO","PSQL","ORACLE","SQLSERVER","MYSQL","HIVE","ELS","KAFKA"];

  constructor(private service: ScriptWriterService, private dataIngestion: DataIngestionService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.initAddFileForm();
    this.initCommitForm();
    this.initDeleteGitFileForm();
    this.initEditGitFileForm();
    this.initZeppelinRunForm();
    this.route.queryParams.subscribe(params => {
      this.projectName = params['projectName'];
      this.flowId = parseInt(params['flowId']);
      this.tname = (params['tname']);
      this.tlevel = (params['tlevel']);
      this.lineageId = parseInt(params['lineageId']);
      this.loadSourceNodes();
    });
    this.loadScriptFromNode();
  }

  loadSourceNodes() {
    this.service.fetchNodeDetails(this.flowId, 1).subscribe((res) => {
      if (res['statusType'].toLowerCase() == "info") {
        let response = res['response'];
        response.forEach((element, index) => {
          let obj = element;
          obj["id"] = index + 1; 
          this.sourcesList.push(obj);
          obj["nodeType"] = Constants.fetchNodeByID(element.nodeTypeId)['nodeName'];
        });
      }
      else {
        this.toastr.error((res['statusMessage']));
      }
    }, error => {
      if (error.error.error == "invalid_grant") {
        return
      }
      this.toastr.error("Something went wrong please try again!!");
    })
  }

  gitFiles(fileName, isDirectory?) {
    let fileExt = fileName.split(".")
    let extIndex = fileExt.length - 1
    if (fileExt[extIndex] == 'dvc') {
      this.isDvcFile = true
    }
    else {
      this.isDvcFile = false
    }
    if (isDirectory) {
      this.folderPath.push(fileName);
      this.loadGitFolders();
    }
    else {
      this.resetFileVersions();
      this.cmFileName = fileName;
      this.filePath = this.folderPath.join("/") + "/" + fileName;
      let body = { fName: this.filePath };
      this.service.getFiles(body).subscribe((response: any) => {
        if (response['statusType'].toLowerCase() == "info") {
          this.fileVersions = response.response;
        }
        else {
          this.toastr.error((response['statusMessage']));
        }
      }, error => {
        if (error.error.error == "invalid_grant") {
          return
        }
        this.toastr.error("Something went wrong please try again!!");
      })
    }
  }

  submitFileVersions() {
    let body = { fName: this.filePath, commitId: this.selCommitID, method: this.method };
    this.service.postFileVersions(body).subscribe((response: any) => {
      if (response['statusType'].toLowerCase() == "info") {
        let res = response.response;
        let filePath = this.filePath.split("/");
        let extension = filePath[filePath.length - 1].split(".")[1];
        this.formatCMbyExtension(extension);
        this.code = res.fContent;
      }
      else {
        this.toastr.error((response['statusMessage']));
      }
    }, error => {
      if (error.error.error == "invalid_grant") {
        return
      }
      this.toastr.error("Something went wrong please try again!!")
    })
  }

  formatCMbyExtension(extension?: string) {
    if (!extension) {
      this.selectedInterpreter = "python";
    } else if (extension.includes("ql")) {
      switch (extension) {
        case ("hql"):
          this.selectedInterpreter = "hql";
          break;
        case ("snowsql"):
          this.selectedInterpreter = "snowflakesql";
          break;
        case ("cql"):
          this.selectedInterpreter = "cassandrasql";
          break;
        default:
          this.selectedInterpreter = "sql";
      }
    } else if (extension == "py") {
      this.selectedInterpreter = "python";
    } else if (extension == "r") {
      this.selectedInterpreter = "r";
    } else if (extension == "java") {
      this.selectedInterpreter = "java";
    }
    this.cmOptions["mode"] = this.interpreterDetails[this.selectedInterpreter];
  }

  ScriptRun() {
    if (this.zeppelinRunForm.invalid) {
      return
    }
    var sourceInfo = [];
    this.zep["zeppelinSources"].value.forEach(source => {
      sourceInfo.push(source["name"] + "@@" + source["nodeType"]);
    });
    var targetInfo = [];
    this.zepTgt.value.forEach(obj => {
      let targetData = obj.targetName + "@@" + obj.targetType;
      targetInfo.push(targetData);
    });
    let body = {
      "fName": this.filePath,
      "bucket": this.zeppelinRunForm.value.bucketName,
      "async": this.zeppelinRunForm.value.mode,
      "runComments": this.zeppelinRunForm.value.comments,
      "sources": sourceInfo,
      "targets": targetInfo,
      "interpreter": this.selectedInterpreter,
      "textdata": this.code,
      "flowId": this.flowId
    }
    this.service.zeppelinConnectService(body).subscribe((response: any) => {
      if (response['statusType'].toLowerCase() == "info") {
        this.showRunScriptMsg = true;
        this.status = "Success";
        this.message = response['statusMessage'];
        setTimeout(() => {
          this.showRunScriptMsg = false;
        }, 3000);
      }
      else {
        this.showRunScriptMsg = true;
        this.status = "Failure";
        this.message = response['statusMessage'];
        setTimeout(() => {
          this.showRunScriptMsg = false;
        }, 3000);
      }

    },
      error => {
        this.showRunScriptMsg = true;
        this.status = "Failure";
        this.message = "something went wrong";
        setTimeout(() => {
          this.showRunScriptMsg = false;
        }, 3000);
      })
  }

  scriptCommit() {
    if (this.commitForm.invalid) {
      return;
    }
    let body = { filePath: this.filePath, content: this.code, cmtMsg: this.commitForm.value.commitMsg }
    this.service.commitScript(body).subscribe((Response: any) => {
      if (Response['statusType'].toLowerCase() == "info") {
        this.showCodeCommitMsg = true;
        this.status = "Success";
        this.message = Response['statusMessage'];
        setTimeout(() => {
          this.showCodeCommitMsg = false;
        }, 3000);
      }
      else {
        this.showCodeCommitMsg = true;
        this.status = "Failure";
        this.message = Response['statusMessage'];
        setTimeout(() => {
          this.showCodeCommitMsg = false;
        }, 3000);
      }
    }, error => {
      this.showCodeCommitMsg = true;
      this.status = "Failure";
      this.message = "something went wrong";
      setTimeout(() => {
        this.showCodeCommitMsg = false;
      }, 3000);
    })
  }

  addScriptFile() {
    if (this.addFile.invalid) {
      return;
    }
    this.service.scriptFile(this.addFile.value.folderName, this.addFile.value.fileToUpload, this.addFile.value.dvc, this.addFile.value.comments).subscribe((Response: any) => {
      this.initAddFileForm();
      if (Response['statusType'].toLowerCase() == "info") {
        this.showAddFilesMsg = true;
        this.status = "Success";
        this.message = Response['statusMessage'];
        setTimeout(() => {
          this.showAddFilesMsg = false;
        }, 3000);
      }
      else {
        this.showAddFilesMsg = true;
        this.status = "Failure";
        this.message = Response['statusMessage'];
        setTimeout(() => {
          this.showAddFilesMsg = false;
        }, 3000);
      }
    }, error => {
      this.showAddFilesMsg = true;
      this.status = "Failure";
      this.message = "something went wrong";
      setTimeout(() => {
        this.showAddFilesMsg = false;
      }, 3000);
    })
  }

  deSelectAllSources() {
    this.zeppelinRunForm.patchValue({zeppelinSources: []});
  }

  initZeppelinRunForm() {
    this.selectedSourceNodes = [];
    this.zeppelinRunForm = this.formBuilder.group({
      zeppelinSources: [[], Validators.required],
      zeppelinTargets: this.formBuilder.array([this.formBuilder.group({
        targetType: ['', Validators.required],
        targetName: ['', Validators.required, this.nodeNameValidator.bind(this)]
      })]),
      bucketName: ['', Validators.required],
      mode: ['', Validators.required],
      comments: ['', Validators.required]
    });
  }

  resetFileVersions() {
    this.selCommitID = null;
    this.fileVersions = [];
  }

  initCommitForm() {
    this.commitForm = this.formBuilder.group({
      commitMsg: ['', Validators.required]
    });
  }

  initDeleteGitFileForm() {
    this.deleteGitFileForm = this.formBuilder.group({
      fName: ['', Validators.required],
      cmtMsg :['', Validators.required]
    });
  }

  initEditGitFileForm() {
    this.editGitFileForm = this.formBuilder.group({
      fName: ['', Validators.required],
      newFileName : ['', Validators.required],
      cmtMsg :['', Validators.required]
    });
  }

  initAddFileForm() {
    var folderName = '';
    this.filePlaceHolder = "Upload a file";
    this.folderPath.join("/");
    if (this.folderPath.length > 0) {
      folderName = this.folderPath.join("/");
    };
    this.addFile = this.formBuilder.group({
      fileToUpload: [null, Validators.required],
      folderName: [folderName, Validators.required],
      dvc: [false, Validators.required],
      comments: ['', Validators.required]
    });
  }

  uploadFile(files: FileList) {
    this.addFile.patchValue({ fileToUpload: files.item(0) });
    this.filePlaceHolder = files.item(0).name;
  }

  redirectToLineage() {
    this.router.navigate(['/lineage'],
      { queryParams: { 'flowId': this.flowId, 'projectName': this.projectName } });
  }

  loadGitFolders() {
    let body;
    if (this.folderPath.length > 0) {
      body = { "filePath": this.folderPath.join("/") }
    }
    else {
      body = { "filePath": "" }
    }
    this.service.gitFolderPreview(body).subscribe((res) => {
      if (res["status"] == 200) {
        this.gitFoldersDetails = res['response'];
        for (let i = 0; i < this.gitFoldersDetails.length; i++) {
          this.gitFoldersDetails[i]["id"] = i + 1;
        }
        this.initAddFileForm();
      } else {
        this.toastr.error(res["statusMessage"]);
      }
    }), error => {
      this.toastr.error("Could not load git folders ! Please try again");
    }
  }

  loadScriptFromNode() {
    let body = { "method": "getCodeOfTable", "lineageId": this.lineageId }
    this.service.zepplin(body).subscribe((Response: any) => {
      if (Response['statusType'].toLowerCase() == "info") {
        var res = Response.response;
        this.code = res.fContent;
        this.filePath = res.fName;
        let dir = res.fName.split("/");
        let fileName = dir[dir.length - 1];
        this.folderPath = dir.slice(0, dir.length - 1);
        this.loadGitFolders();
        this.initAddFileForm();
        this.cmFileName = fileName;
        let extension = fileName.split(".")[1];
        this.formatCMbyExtension(extension);
      }
      else {
        this.code = "";
        this.loadGitFolders();
      }
    }, error => {
      this.toastr.error("Could not load script for node! Please try again.")
    });
  }

  get zep() { return this.zeppelinRunForm.controls; }
  get zepTgt() { return this.zeppelinRunForm.get('zeppelinTargets') as FormArray };

  addTargetNode() {
    this.zepTgt.insert(0, this.formBuilder.group({
      targetType: ['', Validators.required],
      targetName: ['', Validators.required, this.nodeNameValidator.bind(this)]
    }));
  }

  removeTargetNode(index: number) {
    this.zepTgt.removeAt(index);
  }

  getNodeNameControl(i) {
    return (<FormArray>this.zeppelinRunForm.get('zeppelinTargets')).controls[i]['controls'].targetName.errors;
  }

  onChangeTargetType(i) {
    this.zeppelinRunForm.get('zeppelinTargets')['controls'][i]['controls'].targetName.reset();
  }

  nodeNameValidator(control: FormControl) {
    return timer(500).pipe(switchMap(() => {
      const promise = new Promise<any>((resolve, reject) => {
        if (control.value != "") {
          if (control.parent.controls['targetType'].value == "") {
            resolve({ 'message': "*Please select target type" });
            return null;
          }
          let targetType = control.parent.controls['targetType'].value.toLowerCase();
          let targetNodeTypeId = Constants.fetchNodeByNameType(targetType, 'data')['nodeTypeId'];
          let reqBody =
          {
            "name": control.value,
            "nodeTypeId": targetNodeTypeId
          }
          this.dataIngestion.validateTableName(reqBody).toPromise().then((res) => {
            if (res['statusType'].toLowerCase() == "info") {
              resolve(null);
            }
            else {
              if (res['statusMessage'].includes("already exists.")) {
                resolve({ 'message': 'Target already exists' });
              }
              else {
                resolve({ 'message': res['statusMessage'] });
              }
            }
          })
        }
      })
      return promise
    }));
  }

  changeDir(dir?) {
    if (dir) {
      let index = this.folderPath.indexOf(dir) + 1;
      if (index == this.folderPath.length) {
        return
      }
      this.folderPath.splice(index);
    }
    else {
      let dirLength = this.folderPath.length;
      if (dirLength == 0) {
        return
      }
      this.folderPath.splice(dirLength - 1);
    }
    this.loadGitFolders();
  }

  setDeletePath(fileName : string)
  {
    this.deleteGitFileForm.patchValue({ fName :  this.folderPath.join("/") + "/" + fileName});
  }

  setEditPath(fileName : string)
  {
    this.editGitFileForm.patchValue({ fName :  this.folderPath.join("/") + "/" + fileName});
  }

  deleteGitFiles()
  {
    let body = 
    {
      "fName" : this.deleteGitFileForm.value.fName,
      "cmtMsg" : this.deleteGitFileForm.value.cmtMsg
    }
    this.service.deteleGitFiles(body).subscribe((response)=>
    {
      if (response['statusType'].toLowerCase() == "info") {
        this.showDeleteGitFileMsg = true;
        this.status = "Success";
        this.message = response['statusMessage'];
        setTimeout(() => {
          this.showDeleteGitFileMsg = false;
        }, 3000);
      }
      else {
        this.showDeleteGitFileMsg = true;
        this.status = "Failure";
        this.message = response['statusMessage'];
        setTimeout(() => {
          this.showDeleteGitFileMsg = false;
        }, 3000);
      }
    })
  }

  editGitFileName()
  {
    let body = 
    {
      "fName" : this.editGitFileForm.value.fName,
      "newFileName" : this.folderPath.join("/") + "/" + this.editGitFileForm.value.newFileName,
      "cmtMsg" : this.editGitFileForm.value.cmtMsg
    }
    this.service.editGitFile(body).subscribe((response)=>
    {
      if (response['statusType'].toLowerCase() == "info") {
        this.status = "Success";
        this.message = response['statusMessage'];
        this.showEditGitFileMsg = true;
        setTimeout(() => {
          this.showEditGitFileMsg = false;
        }, 3000);
      }
      else {
        this.showEditGitFileMsg = true;
        this.status = "Failure";
        this.message = response['statusMessage'];
        setTimeout(() => {
          this.showEditGitFileMsg = false;
        }, 3000);
      }

    })

  }
}

