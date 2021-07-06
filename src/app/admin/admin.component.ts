import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public userList: any = [];
  userGroup = ['AppAdmin', 'BusinessUser', 'DataAnalyst', 'DataEngineer']
  searchUser: string = '';
  public userName: string;
  public userSearch: string;
  form: FormGroup
  public nameFlag: boolean = false;
  showUsers: boolean = false;
  isNameExist : boolean;
  validateUserName = new Subject<string>();
  isFormInvalid : boolean = false

  constructor(private adminService: AdminService, private formBuilder: FormBuilder, private toastr: ToastrService) {
    this.validateUserName.pipe(
      debounceTime(500),
      distinctUntilChanged())
      .subscribe(value => {
        this.checkName();
      });
  }

  ngOnInit() {
    this.adminService.listUsers().subscribe((Response: any) => {
      this.showUsers = true;
      this.userList = Response.response;
    }, error => {
      this.toastr.error('Failed to fetch user list');
    })
    this.handleForm();
  }

  handleForm() {
    this.form = this.formBuilder.group({
      userName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastname: ['', Validators.required],
      selectedGrp: ['AppAdmin', Validators.required],
      email: ['', Validators.required],
      phoneNo: ['', Validators.required]
    });
    this.isFormInvalid = false;
  }

  submitUserForm() {
    if(this.form.invalid || this.isNameExist)
    {
      this.isFormInvalid = true
      return;
    }
    else
    {
      this.isFormInvalid = false
    }
      this.adminService.createUsers(this.form.value).subscribe((Response: any) => {
        if (Response['statusType'].toLowerCase() == "info") {
          this.toastr.success("User created");
        }
        else {
          this.toastr.error("faied to create user")
        }
      })
  }

  checkName() {
    if (this.form.value.userName == '') {
      return
    }
    var body =
    {
      "userName": this.form.value.userName.toLowerCase()
    }
    this.adminService.checkUserName(body).subscribe((Response) => {
      console.log(Response);
      if (Response['statusType'].toLowerCase() == "info") {
        this.isNameExist = true;
      }
      else {
        this.isNameExist = false;
      }
    }, error => {
      console.log(error)
    })
  }

  deleteUser(user) {
    console.log(user);
    var body =
    {
      "userName": user.cn,
      "email": user.mail,
      "firstName": user.givenname,
      "lastname": user.sn,
      "phoneNo": user.telephoneNumber,
      "selectedGrp": user.groups[0]
    }
    this.adminService.deleteUser(body).subscribe((res) => {
      if(Response['statusType'].toLowerCase() == "info")
      {
        this.toastr.success("User deleted");
      }  
    }, error => {
      this.toastr.error('Failed to delete user');
    })
  }

  resetPassword() {
    let userName = ""
    this.adminService.resetPassword(userName).subscribe((Res) => {

    }, error => {

    })
  }

  getControls()
  {
     return this.form.controls;
  }
}
