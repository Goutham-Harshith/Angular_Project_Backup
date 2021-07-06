import { Component, OnInit } from '@angular/core';
import { PoReportService } from './po-reports.service';
import { Chart } from 'chart.js';
import * as $ from 'jquery';

@Component({
  selector: 'app-po-reports',
  templateUrl: './po-reports.component.html',
  styleUrls: ['./po-reports.component.css']
})
export class PoReportsComponent implements OnInit {

  constructor(private poReportService: PoReportService) { }

  report1Data;
  report2Data;
  report3Data;
  report1Chart: Chart;
  report2Chart: Chart;
  report3Chart: Chart;

  ngOnInit() {
    this.report1();
    this.report2();
    this.report3();
  }

  report1() {
    this.poReportService.fetchReport("POT", "POTR1", "Purchase Order Trend").subscribe((Response: any) => {
      this.report1Data = Response.response;
      var dataSet1 = { "label": "", "data": [], "borderColor": 'red', "pointRadius": 3, borderWidth: 1, };
      var dataSet2 = { "label": "", "data": [], "borderColor": 'blue', "pointRadius": 3, borderWidth: 1, };
      var labels = [];
      dataSet1["label"] = this.report1Data["yAxisName"].split(",")[0];
      dataSet2["label"] = this.report1Data["yAxisName"].split(",")[1];
      this.report1Data["reportingFrameworkDto"].forEach(obj => {
        labels.push(obj["x"]);
        dataSet1["data"].push(obj["y"][0]);
        dataSet2["data"].push(obj["y"][1]);
      });
      this.plotReport1(labels, dataSet1, dataSet2);
    }
    )
  }

  report2() {
    this.poReportService.fetchReport("POT", "POTR2", "Top 10 Commodities").subscribe((Response: any) => {
      this.report2Data = Response.response;
      var dataSet = { "label": "", "data": [], "borderColor": 'red', "pointRadius": 3, borderWidth: 1, };
      var labels = [];
      dataSet["label"] = this.report2Data["yAxisName"];
      this.report2Data["reportingFrameworkDto"].forEach(obj => {
        labels.push(obj["y"][0]);
        dataSet["data"].push(obj["x"]);
      });
      this.plotReport2(labels, dataSet);
    }
    )
  }

  report3() {
    this.poReportService.fetchReport("POT", "POTR3", "Last 180 days PO Trend").subscribe((Response: any) => {
      this.report3Data = Response.response;
      var dataSet1 = { "label": "", "data": [], "borderColor": 'red', "pointRadius": 3, borderWidth: 1, };
      var dataSet2 = { "label": "", "data": [], "borderColor": 'blue', "pointRadius": 3, borderWidth: 1, };
      var labels = [];
      dataSet1["label"] = this.report3Data["yAxisName"].split(",")[0];
      dataSet2["label"] = this.report3Data["yAxisName"].split(",")[1];
      this.report3Data["reportingFrameworkDto"].forEach(obj => {
        labels.push(obj["x"]);
        dataSet1["data"].push(obj["y"][0]);
        dataSet2["data"].push(obj["y"][1]);
      });
      this.plotReport3(labels, dataSet1, dataSet2);
    }
    )
  }

  plotReport1(labels, dataSet1, dataSet2) {
    const canvas = document.getElementById('report1') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    this.report1Chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [dataSet1, dataSet2],
        pointRadius: 1
      },
      options: {
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        responsive: true,
        legend: {
          position: "top"
        },
        title: {
          display: true,
          text: this.report1Data["graphName"]
        },
        scales: {
          xAxes: [{
            ticks: {
              userCallback: function (label) {
                if (label.length >= 15)
                  return label.slice(0, 15) + "...";
                else
                  return label;
              }
            },
            scaleLabel: {
              display: true,
              labelString: this.report1Data["xAxisName"],
              fontStyle: 'bold'
            }
          }],
          yAxes: [{
            type: 'logarithmic',
            scaleLabel: {
              display: true,
              labelString: "Amount",
              fontStyle: 'bold'
            },
            ticks: {
              beginAtZero: true,
              min: 0,
              max: 100000000000,
              callback: function (value, index, values) {
                if (value === 100000000000) return "100B";
                if (value === 10000000000) return "10B";
                if (value === 1000000000) return "1B";
                if (value === 100000000) return "100M";
                if (value === 10000000) return "10M";
                if (value === 1000000) return "1M";
                if (value === 100000) return "100K";
                if (value === 10000) return "10K";
                if (value === 1000) return "1K";
                if (value === 100) return "100";
                if (value === 10) return "10";
                if (value === 0) return "0";
                return null;
              }
            }
          }]
        }
      }
    });
  }

  plotReport2(labels, dataSet) {
    const canvas = document.getElementById('report2') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    this.report1Chart = new Chart(ctx, {
      type: 'horizontalBar',
      data: {
        labels: labels,
        datasets: [dataSet],
        pointRadius: 1
      },
      options: {
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        responsive: true,
        legend: {
          position: "top"
        },
        title: {
          display: true,
          text: this.report2Data["graphName"]
        },
        scales: {
          xAxes: [{
            type: 'logarithmic',
            ticks: {
              // type: 'logarithmic',
              beginAtZero: true,
              min: 0,
              max: 100000000000,
              callback: function (value, index, values) {
                if (value === 10000000000) return "10B";
                if (value === 1000000000) return "1B";
                if (value === 100000000) return "100M";
                if (value === 10000000) return "10M";
                if (value === 1000000) return "1M";
                if (value === 100000) return "100K";
                if (value === 10000) return "10K";
                if (value === 1000) return "1K";
                if (value === 100) return "100";
                if (value === 10) return "10";
                if (value === 0) return "0";
                return null;
              }
            },
            scaleLabel: {
              display: true,
              labelString: this.report2Data["xAxisName"],
              fontStyle: 'bold'
            },

          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.report2Data["yAxisName"],
              fontStyle: 'bold'
            }
          }]
        }
      }
    });
  }

  plotReport3(labels, dataset1, dataset2) {
    console.log("lbels is ", labels);
    console.log("Dataset1 is ", dataset1);
    console.log("dataset 2" , dataset2);
    const canvas = document.getElementById('report3') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    this.report3Chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [dataset1, dataset2],
        pointRadius: 1
      },
      options: {
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        responsive: true,
        legend: {
          position: "top"
        },
        title: {
          display: true,
          text: this.report3Data["graphName"]
        },
        scales: {
          xAxes: [{
            ticks: {
              userCallback: function (label) {
                if (label.length >= 15)
                  return label.slice(0, 15) + "...";
                else
                  return label;
              }
            },
            scaleLabel: {
              display: true,
              labelString: this.report3Data["xAxisName"],
              fontStyle: 'bold'
            }
          }],
          yAxes: [{
            type: 'logarithmic',
            scaleLabel: {
              display: true,
              labelString: "Amount",
              fontStyle: 'bold'
            },
            ticks: {
              beginAtZero: true,
              min: 0,
              max: 100000000000,
              callback: function (value, index, values) {
                if (value === 100000000000) return "100B";
                if (value === 10000000000) return "10B";
                if (value === 1000000000) return "1B";
                if (value === 100000000) return "100M";
                if (value === 10000000) return "10M";
                if (value === 1000000) return "1M";
                if (value === 100000) return "100K";
                if (value === 10000) return "10K";
                if (value === 1000) return "1K";
                if (value === 100) return "100";
                if (value === 10) return "10";
                if (value === 0) return "0";
                return null;
              }
            }
          }]
        }
      }
    });
  }
}
