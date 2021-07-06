import { Component, OnInit, Input } from '@angular/core';
import * as $ from 'jquery';
@Component({
  selector: 'app-success-and-failure',
  templateUrl: './success-and-failure.component.html',
  styleUrls: ['./success-and-failure.component.css']
})
export class SuccessAndFailureComponent implements OnInit {
  constructor() { }
  @Input() status: string;
  @Input() message: string;
  ngOnInit() {
  }
  statusClose() {
    $("#show_hide_bt").remove();
  }
}
