import { Component, OnInit } from '@angular/core';
// import * as moment from 'moment';
import * as moment from 'moment-timezone';
import { SchedulerService } from './scheduler.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { timer } from 'rxjs'

declare var require: any;
var leapYear = require('leap-year');
@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit {

  constructor(private schedulerService: SchedulerService, private formBuilder: FormBuilder, private toastr: ToastrService, private datePipe: DatePipe) { }
  public freqSelected: number = 1;
  public freqMinSelected: number = 0;
  public freqHourSelected: number = 0;
  public freqWeekSelected: number = 7;
  public freqMonthSelected: number = 1;
  public freqYearMonthSelected: number = 1;
  public freqOutput: string = '* * * * *'
  public freqYearMonSelected: number = 1;

  public tempTime = new Date();
  public currentMonth: any;
  public currentYear: any;
  public isLeapYear: any;

  public cronOutput: any;
  public cronHour: any = '*';
  public cronDay: any = '*';
  public cronWeek: any = '*';
  public cronMonth: any = '*';
  public cronYear: any = '*';
  //  Cron Frequency
  frequency = [{ freq: "Minute", value: 1 }, { freq: "Hour", value: 2 }, { freq: "Day", value: 3 }, { freq: "Week", value: 4 }, { freq: "Month", value: 5 }, { freq: "Year", value: 6 }]
  months = [{ month: "January", value: 1 }, { month: "Febuary", value: 2 }, { month: "March", value: 3 }, { month: "April", value: 4 }, { month: "May", value: 5 }, { month: "June", value: 6 }, { month: "July", value: 7 }, { month: "August", value: 8 }, { month: "Septmber", value: 9 }, { month: "Octomber", value: 10 }, { month: "November", value: 11 }, { month: "December", value: 12 }]
  weeks = [{ week: "Sunday", value: 7 }, { week: "Monday", value: 1 }, { week: "Tuesday", value: 2 }, { week: "Wednesday", value: 3 }, { week: "Thursday", value: 4 }, { week: "Friday", value: 5 }, { week: "Saturday", value: 6 }]
  minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
  hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
  days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]
  //date picker

  minDate = new Date();
  dates = new Array();
  years = new Array();
  today: Date;
  data = { timeZone: "" };
  p: any = 1;
  schedulerName: string;
  selectedWorkflows = [];
  startDate: string;
  endDate: string;
  workflows = [];
  scheduleJobs = [];
  selectedSchedulejob: string;
  selectedindex: number;
  schedulJobId: number;
  searchSchedule: string;
  isenable: boolean = false;
  pageSize: number = 10;
  currentPage: number = 1
  multiDropdownSettings = {
    text: "Select flows",
    enableSearchFilter: true,
    classes: "myclass custom-class",
    badgeShowLimit: 2,
    labelKey: "name",
  };
  scheduleJobForm: FormGroup;
  isFormInvalid : boolean = false;

  ngOnInit() {
    this.initSchedularJobForm();
    let i;
    let m = moment().daysInMonth();

    for (i = 0; i < m; i++) {
      this.dates[i] = i;
    }
    let y = moment().year();

    for (i = 0; i <= m; i++) {
      this.years[i] = y + i;
    }
    this.currentMonth = this.tempTime.getMonth();
    this.currentYear = this.tempTime.getFullYear();
    this.isLeapYear = leapYear(this.currentYear);
    this.chartFrequency();
    this.getSchedulerJobs()
    this.getSchedulerWorkflows()
  }

  public chartFrequency() {
    if (this.freqSelected == 1) {
      this.cronDay = '*';
      this.cronMonth = '*';
      this.cronYear = '*';
      this.cronWeek = '*';
      this.cronHour = this.freqMinSelected;
      this.cronOutput = this.cronHour + ' ' + this.cronDay + ' ' + this.cronMonth + ' ' + this.cronYear + ' ' + this.cronWeek;
    }
    else if (this.freqSelected == 2) {
      this.cronDay = '*';
      this.cronMonth = '*';
      this.cronYear = '*';
      this.cronWeek = '*';
      this.cronHour = this.freqMinSelected;
      this.cronOutput = this.cronHour + ' ' + this.cronDay + ' ' + this.cronMonth + ' ' + this.cronYear + ' ' + this.cronWeek;
    }
    else if (this.freqSelected == 3) {
      this.cronDay = this.freqHourSelected;
      this.cronMonth = '*';
      this.cronYear = '*';
      this.cronWeek = '*';
      this.cronHour = this.freqMinSelected;
      this.cronOutput = this.cronHour + ' ' + this.cronDay + ' ' + this.cronMonth + ' ' + this.cronYear + ' ' + this.cronWeek;
    }
    else if (this.freqSelected == 4) {
      this.cronDay = this.freqHourSelected;
      this.cronMonth = '*';
      this.cronYear = '*';
      this.cronWeek = this.freqWeekSelected;
      this.cronHour = this.freqMinSelected;
      this.cronOutput = this.cronHour + ' ' + this.cronDay + ' ' + this.cronMonth + ' ' + this.cronYear + ' ' + this.cronWeek;
    }
    else if (this.freqSelected == 5) {
      this.cronDay = this.freqHourSelected;
      this.cronMonth = this.freqMonthSelected;
      this.cronYear = '*';
      this.cronWeek = '*';
      this.cronHour = this.freqMinSelected;
      this.cronOutput = this.cronHour + ' ' + this.cronDay + ' ' + this.cronMonth + ' ' + this.cronYear + ' ' + this.cronWeek;
    }
    else if (this.freqSelected == 6) {
      this.cronDay = this.freqHourSelected;
      this.cronMonth = this.freqYearMonthSelected;
      this.cronYear = this.freqYearMonSelected;
      this.cronWeek = '*';
      this.cronHour = this.freqMinSelected;
      this.cronOutput = this.cronHour + ' ' + this.cronDay + ' ' + this.cronMonth + ' ' + this.cronYear + ' ' + this.cronWeek;
    }
    this.scheduleJobForm.patchValue({ cronFreqInput : this.cronOutput})
  }


  public cronMinChange() {
    if (this.freqSelected == 2) {
      this.cronDay = '*';
      this.cronMonth = '*';
      this.cronYear = '*';
      this.cronWeek = '*';
      this.cronHour = this.freqMinSelected;
      this.cronOutput = this.cronHour + ' ' + this.cronDay + ' ' + this.cronMonth + ' ' + this.cronYear + ' ' + this.cronWeek;
    }
    else if (this.freqSelected == 3) {
      this.cronDay = this.freqHourSelected;
      this.cronMonth = '*';
      this.cronYear = '*';
      this.cronWeek = '*';
      this.cronHour = this.freqMinSelected;
      this.cronOutput = this.cronHour + ' ' + this.cronDay + ' ' + this.cronMonth + ' ' + this.cronYear + ' ' + this.cronWeek;
    }
    else if (this.freqSelected == 4) {
      this.cronDay = this.freqHourSelected;
      this.cronMonth = '*';
      this.cronYear = '*';
      this.cronWeek = this.freqWeekSelected;
      this.cronHour = this.freqMinSelected;
      this.cronOutput = this.cronHour + ' ' + this.cronDay + ' ' + this.cronMonth + ' ' + this.cronYear + ' ' + this.cronWeek;
    }
    else if (this.freqSelected == 5) {
      this.cronDay = this.freqHourSelected;
      this.cronMonth = this.freqMonthSelected;
      this.cronYear = '*';
      this.cronWeek = '*';
      this.cronHour = this.freqMinSelected;
      this.cronOutput = this.cronHour + ' ' + this.cronDay + ' ' + this.cronMonth + ' ' + this.cronYear + ' ' + this.cronWeek;
    }
    else if (this.freqSelected == 6) {
      this.cronDay = this.freqHourSelected;
      this.cronMonth = this.freqYearMonthSelected;
      this.cronYear = this.freqYearMonSelected;
      this.cronWeek = '*';
      this.cronHour = this.freqMinSelected;
      this.cronOutput = this.cronHour + ' ' + this.cronDay + ' ' + this.cronMonth + ' ' + this.cronYear + ' ' + this.cronWeek;
    }
    this.scheduleJobForm.patchValue({ cronFreqInput : this.cronOutput})
  }


  public cronHourChange() {
    if (this.freqSelected == 3) {
      this.cronDay = this.freqHourSelected;
      this.cronMonth = '*';
      this.cronYear = '*';
      this.cronWeek = '*';
      this.cronHour = this.freqMinSelected;
      this.cronOutput = this.cronHour + ' ' + this.cronDay + ' ' + this.cronMonth + ' ' + this.cronYear + ' ' + this.cronWeek;
    } else if (this.freqSelected == 4) {
      this.cronDay = this.freqHourSelected;
      this.cronMonth = '*';
      this.cronYear = '*';
      this.cronWeek = this.freqWeekSelected;
      this.cronHour = this.freqMinSelected;
      this.cronOutput = this.cronHour + ' ' + this.cronDay + ' ' + this.cronMonth + ' ' + this.cronYear + ' ' + this.cronWeek;
    } else if (this.freqSelected == 5) {
      this.cronDay = this.freqHourSelected;
      this.cronMonth = this.freqMonthSelected;
      this.cronYear = '*';
      this.cronWeek = '*';
      this.cronHour = this.freqMinSelected;
      this.cronOutput = this.cronHour + ' ' + this.cronDay + ' ' + this.cronMonth + ' ' + this.cronYear + ' ' + this.cronWeek;
    } else if (this.freqSelected == 6) {
      this.cronDay = this.freqHourSelected;
      this.cronMonth = this.freqYearMonthSelected;
      this.cronYear = this.freqYearMonSelected;
      this.cronWeek = '*';
      this.cronHour = this.freqMinSelected;
      this.cronOutput = this.cronHour + ' ' + this.cronDay + ' ' + this.cronMonth + ' ' + this.cronYear + ' ' + this.cronWeek;
    }
    this.scheduleJobForm.patchValue({ cronFreqInput : this.cronOutput})
  }

  public cronWeekChange() {
    if (this.freqSelected == 4) {
      this.cronDay = this.freqHourSelected;
      this.cronMonth = '*';
      this.cronYear = '*';
      this.cronWeek = this.freqWeekSelected;
      this.cronHour = this.freqMinSelected;
      this.cronOutput = this.cronHour + ' ' + this.cronDay + ' ' + this.cronMonth + ' ' + this.cronYear + ' ' + this.cronWeek;
    }
    this.scheduleJobForm.patchValue({ cronFreqInput : this.cronOutput})
  }

  public freqMonthChange() {
    if (this.freqSelected == 5) {
      this.cronDay = this.freqHourSelected;
      this.cronMonth = this.freqMonthSelected;
      this.cronYear = '*';
      this.cronWeek = '*';
      this.cronHour = this.freqMinSelected;
      this.cronOutput = this.cronHour + ' ' + this.cronDay + ' ' + this.cronMonth + ' ' + this.cronYear + ' ' + this.cronWeek;
    }
    this.scheduleJobForm.patchValue({ cronFreqInput : this.cronOutput})
  }
  public cronYearly() {
    if (this.freqSelected == 6) {
      this.cronDay = this.freqHourSelected;
      this.cronMonth = this.freqYearMonthSelected;
      this.cronYear = this.freqYearMonSelected;
      this.cronWeek = '*';
      this.cronHour = this.freqMinSelected;
      this.cronOutput = this.cronHour + ' ' + this.cronDay + ' ' + this.cronMonth + ' ' + this.cronYear + ' ' + this.cronWeek;
    }
    this.scheduleJobForm.patchValue({ cronFreqInput : this.cronOutput})
  }

  public cronFreqMonth() {
    if (this.freqSelected == 6) {
      this.cronDay = this.freqHourSelected;
      this.cronMonth = this.freqYearMonthSelected;
      this.cronYear = this.freqYearMonSelected;
      this.cronWeek = '*';
      this.cronHour = this.freqMinSelected;
      this.cronOutput = this.cronHour + ' ' + this.cronDay + ' ' + this.cronMonth + ' ' + this.cronYear + ' ' + this.cronWeek;
    }
    this.scheduleJobForm.patchValue({ cronFreqInput : this.cronOutput})
  }

  submitScheduler() {
   if(this.scheduleJobForm.invalid)
   {
      this.isFormInvalid = true;
      return;
   }
    var body = {
      "jobIds": this.scheduleJobForm.value.jobIds.map(obj => obj.id),
      "startDate": this.scheduleJobForm.value.startDate,
      "endDate": this.scheduleJobForm.value.endDate,
      "cronFreqInput": this.scheduleJobForm.value.cronFreqInput,
      "schedularName": this.scheduleJobForm.value.schedularName
    };
    this.schedulerService.submitScheduler(body).subscribe(res => {
      this.isenable = true;
      this.resetFields();
      if (res.status == 200) {
        this.toastr.success(res["statusMessage"]);
        this.getSchedulerJobs();
      } else {
        this.toastr.error(res["statusMessage"]);
      }
    })
  }

  initSchedularJobForm() {
    this.scheduleJobForm = this.formBuilder.group({
      cronFreqInput: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      schedularName: ['', Validators.required, this.schedulerNameValidator.bind(this)],
      jobIds: [[], Validators.required]
    });
  }

  schedulerNameValidator(control: FormControl) {
    return timer(500).pipe(switchMap(() => {
      const promise = new Promise<any>((resolve) => {
        if (control.value != "") {
          let reqBody =
          {
            "schedulerName" : control.value,
          }
          this.schedulerService.validateSchedulerName(reqBody).toPromise().then((res) => {
            if (res['statusType'].toLowerCase() == "info") {
              resolve(null);
            }
            else { 
                resolve({ 'message': res['statusMessage'] });
            }
          })
        }
      })
      return promise
    }));
  }

  getFormControls()
  {
    return this.scheduleJobForm.controls
  }

  selectSchedule()
  {
    let selectedSchedules = this.scheduleJobs.find( element => element['checked'] == false);
    if(selectedSchedules == undefined)
    {
      document.getElementById("checkAllFlow")['checked'] = true;
    }
    else
    {
      document.getElementById("checkAllFlow")['checked'] = false;
    }
  }

  selectStartDate()
  {
    this.scheduleJobForm.patchValue({ startDate : this.datePipe.transform(moment(this.startDate).toDate(), "yyyy-MM-dd HH:mm:ssZZZZZ")})
  }

  selectEndDate()
  {
    this.scheduleJobForm.patchValue({ endDate : this.datePipe.transform(moment(this.endDate).toDate(), "yyyy-MM-dd HH:mm:ssZZZZZ")})
  }
  
  getSchedulerWorkflows() {
    let body = {
      "isSchedulerList": "true"
    }
    this.schedulerService.getSchedularWorkflows(body).subscribe(res => {
      this.workflows = res.response
    })
  }

  getSchedulerJobs() {
    this.schedulerService.getScheduleJobs().subscribe(res => {
      if (res['statusType'].toLowerCase() == "info") {
        document.getElementById("checkAllFlow")['checked'] = false;
        this.scheduleJobs = res.response;
        this.scheduleJobs.forEach((obj) => {
          obj["checked"] = false;
        })
      } else {
        this.toastr.error(res["statusMessage"]);
      }
    })
  }

  selectedJob(item: any, i: any) {
    this.selectedSchedulejob = item;
    this.selectedindex = i
    this.schedulJobId = item.id
    this.isenable = true
  }


  deleteJob() {
    let scheduleJobId = [];
    this.scheduleJobs.forEach(obj => {
      if (obj.checked) {
        scheduleJobId.push(obj.id)
      }
    })
    if (scheduleJobId.length > 0) {
      let body = {
        "schedulerId": scheduleJobId,
      }
      this.schedulerService.deleteScheduler(body).subscribe(res => {
        if (res['statusType'].toLowerCase() == "info") {
          this.getSchedulerJobs();
          this.toastr.success(res['statusMessage']);
        } else {
          this.toastr.error("delete failed")
        }
      }, error => {
        this.toastr.error("Something went wrong! Please try again.")
      })
    } else {
      this.toastr.info("select any job..")
    }
  }

  suspendJob() {
    let scheduleJobId = [];
    this.scheduleJobs.forEach(obj => {
      if (obj.checked) {
        scheduleJobId.push(obj.id)
      }
    })
    if (scheduleJobId.length > 0) {
      let body = {
        "schedulerId": scheduleJobId,
      }
      this.schedulerService.suspendScheduler(body).subscribe(res => {
        if (res['statusType'].toLowerCase() == "info") {
          this.getSchedulerJobs();
          this.toastr.success(res['statusMessage'])
        } else {
          this.toastr.error("Suspend failed")
        }
      }, error => {
        this.toastr.error("Something went wrong! Please try again.")
      })
    } else {
      this.toastr.info("select any job..")
    }
  }

  resumeJob() {
    let scheduleJobId = [];
    this.scheduleJobs.forEach(obj => {
      if (obj.checked) {
        scheduleJobId.push(obj.id)
      }
    })
    if (scheduleJobId.length > 0) {
      let body = {
        "schedulerId": scheduleJobId,
      }
      this.schedulerService.resumeScheduler(body).subscribe(res => {
        if (res['statusType'].toLowerCase() == "info") {
          this.getSchedulerJobs();
          this.toastr.success(res['statusMessage'])
        } else {
          this.toastr.error("Resume failed")
        }
      }, error => {
        this.toastr.error("Something went wrong! Please try again.")
      })
    } else {
      this.toastr.info("select any job..")
    }
  }

  checkAll(checked: boolean) {
    this.scheduleJobs.forEach(obj => {
      obj["checked"] = checked;
    });
  }
  // reset fileds
  resetFields() {
    this.initSchedularJobForm()
    this.freqSelected = 1;
    this.chartFrequency()
    this.startDate = "";
    this.endDate = "";
    this.selectedWorkflows = [];
    this.isFormInvalid = false;
  }

}

