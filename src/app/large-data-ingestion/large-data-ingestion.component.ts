import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LargeDataIngestionService } from './large-data-ingestion.service'
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DataIngestionService } from '../data-ingestion/data-ingestion.service';

@Component({
  selector: 'app-large-data-ingestion',
  templateUrl: './large-data-ingestion.component.html',
  styleUrls: ['./large-data-ingestion.component.css']
})
export class LargeDataIngestionComponent implements OnInit {

  filepath: any = "";
  fileNameToIngested = [];
  isFilesLoaded: boolean = false;
  flowId: number;
  editFlag: boolean = false;
  form: FormGroup
  isFormInvalid: boolean = false;
  isLoadFormInvalid: boolean = false;
  projectName: string = "";
  projectNameErrorMsg : string = "";
  validateProjectName = new Subject<string>();

  constructor(private dataIngestionService: LargeDataIngestionService, private service: DataIngestionService ,private toastr: ToastrService, private route: ActivatedRoute, private fb: FormBuilder) 
  {
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
      this.projectName = res['params'].project
    })

    if (this.projectName) {
      this.editFlag = true
    }
    else {
      this.editFlag = false;
    }
    this.loadForm();
  }

  checkProjectName()
  {
    if (this.form.value.projectName == "") {
      return
    }
      this.service.validateProjectName(this.form.value.projectName).subscribe((response)=>
      {
        if (response['statusType'].toLowerCase() == "info") {
          this.projectNameErrorMsg = ''
        }
        else{
          this.form.controls['projectName'].markAsUntouched()
          this.projectNameErrorMsg = response['statusMessage'];
        }
      })
  }

  loadFilepath() {

    if (this.form.value.sourceName != '2') {
      if (this.form.controls.username.invalid || this.form.controls.password.invalid || this.form.controls.host.invalid) {
        this.isLoadFormInvalid = true;
        return;
      }
    }

    var body = {};
    body["srcNodeTypeId"] = parseInt(this.form.value.sourceName);
    body["srcFolder"] = this.form.value.filepath;
    if (this.form.value.sourceName != '2') {
      body["username"] = this.form.value.username;
      body["password"] = this.form.value.password;
      body["host"] = this.form.value.host;
    }
    this.dataIngestionService.fetchFiles(body).subscribe((Response: any) => {
      let response = Response.response;
      if (Response['statusType'].toLowerCase() == "info") {
        for (let i in response) {
          response[i]["selected"] = false;
        }
        this.fileNameToIngested = response;
        this.isFilesLoaded = true;
      }
      else{
        this.toastr.error(Response['statusMessage']);
      }

    }, error => {
      if (error.error.error == "invalid_grant") {
        return
      }
      this.toastr.error("Something went wrong please try again!!")
    });
  }

  loadForm(sourceName?) {
    let updatedSource = "18"
    this.isFormInvalid = false;
    this.isLoadFormInvalid = false;
    this.isFilesLoaded = false;
    if (sourceName) {
      updatedSource = sourceName.target.value
    }
    this.form = new FormGroup({
      projectName: new FormControl(this.projectName, Validators.required),
      sourceName: new FormControl(updatedSource),
      host: new FormControl(""),
      username: new FormControl(""),
      password: new FormControl(""),
      port: new FormControl("22"),
      filepath: new FormControl("/"),
      target: new FormControl("3"),
      destlocation: new FormControl(""),
      largeFileComments: new FormControl("", Validators.required)
    })
  }

  submitForm() {
    if (this.form.value.sourceName != '2' && this.form.invalid || this.projectNameErrorMsg != "") {
      this.isFormInvalid = true
      return;
    }
    else if (this.form.value.sourceName == '2' && this.form.controls.largeFileComments.invalid || this.form.controls.projectName.invalid || this.form.controls.destlocation.invalid ) {
      this.isFormInvalid = true
      return;
    }
    var body = {};
    body["targetFolder"] = this.form.value.destlocation;
    if (this.form.value.filepath == '') {
      this.form.value.filepath = '/'
    }
    body["srcFolder"] = this.form.value.filepath;
    body["trgNodeTypeId"] = parseInt(this.form.value.target);
    body["srcNodeTypeId"] = parseInt(this.form.value.sourceName);
    body["comments"] = this.form.value.largeFileComments;
    if (this.form.value.sourceName != '2') {
      body["host"] = this.form.value.host
      body["username"] = this.form.value.username
      body["password"] = this.form.value.password
    }
    if (this.flowId) {
      body["flowId"] = this.flowId
    }
    else {
      body["jobName"] = this.form.value.projectName;
    }

    this.dataIngestionService.sendFilestoBeCopiedToHDFS(body).subscribe((Response: any) => {
      if (Response['statusType'].toLowerCase() == "info") {
        this.toastr.success(Response['statusMessage'])
      }
      else{
        this.toastr.error(Response['statusMessage'])
      }
    }, error => {
      if (error.error.error == "invalid_grant") {
        return
      }
      this.toastr.error("Something went wrong please try again!!")
    })

  }



}
